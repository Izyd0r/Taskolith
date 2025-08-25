using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth.Refresh;

public class Refresh : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/refresh", Handle)
        .WithSummary("Refresh access token");
    private static async Task<IResult> Handle(
        HttpRequest request,
        HttpResponse response,
        AppDbContext db,
        JwtTokenGenerator jwtTokenGenerator,
        IOptions<JwtOptions> jwtOptions,
        CancellationToken ct
        ) {
        var refreshToken = request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Results.Unauthorized();
        }
        
        var refreshTokenEntity = await db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken, ct);
        
        if (refreshTokenEntity == null || refreshTokenEntity.Expires < DateTime.UtcNow)
        {
            return Results.Unauthorized();
        }
       
        // Anti-Token Theft
        if (refreshTokenEntity.IsActive == false)
        {
            // logger.LogWarning("Potential refresh token theft detected for user {UserId}", refreshTokenEntity.UserId);
            
            var allTokensForUser = await db.RefreshTokens
                .Where(rt => rt.UserId == refreshTokenEntity.UserId && rt.IsActive)
                .ToListAsync(ct);
                
            foreach (var token in allTokensForUser)
            {
                token.IsActive = false;
            }
            await db.SaveChangesAsync(ct);
            return Results.Unauthorized();
        }
    
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
    
        try
        {
            var user = refreshTokenEntity.User;
    
            refreshTokenEntity.IsActive = false;
            
            var newRefreshToken = new RefreshToken {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = JwtTokenGenerator.GenerateRefreshToken(),
                IsActive = true,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            db.RefreshTokens.Add(newRefreshToken);
            
            var newAccessToken = jwtTokenGenerator.GenerateToken(user);
            
            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
           
            response.Cookies.Append("access_token", newAccessToken, new CookieOptions {
                HttpOnly = true,
                Secure = false, // TODO: Set to true in production with HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(jwtOptions.Value.ExpiryMinutes)
            });
           
            response.Cookies.Append("refresh_token", newRefreshToken.Token, new CookieOptions {
                HttpOnly = true,
                Secure = false, // TODO: Set to true in production with HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });
            
            return Results.NoContent();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(ct);
            return Results.StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}