using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.Auth.Login;

public class LoginUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/login", Handle)
        .WithRequestValidation<LoginRequest>()
        .WithSummary("Authenticate a user (login)");

    static async Task<IResult> Handle(
        LoginRequest request,
        AppDbContext dbContext,
        JwtTokenGenerator jwtTokenGenerator,
        HttpResponse response,
        IOptions<JwtOptions> jwtOptions,
        CancellationToken token,
        IPasswordHasher<User> passwordHasher
        ) {
        var user = await dbContext.Users
            .FirstOrDefaultAsync(u=>u.Username == request.Username, cancellationToken: token);
        if (user is null)
        {
            return Results.Unauthorized();
        }
        
        var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
        if (result == PasswordVerificationResult.Failed) return Results.Unauthorized();
    
        var jwt = jwtTokenGenerator.GenerateToken(user);
    
        var refreshToken = new RefreshToken {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = JwtTokenGenerator.GenerateRefreshToken(),
            IsActive = true,
            Created = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(token);
            
        response.Cookies.Append("access_token", jwt, new CookieOptions {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(jwtOptions.Value.ExpiryMinutes)
        });
        
        response.Cookies.Append("refresh_token", refreshToken.Token, new CookieOptions {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        });
    
        var loginResponse = new LoginResponse(user.Username, user.Id);
        
        return Results.Ok(loginResponse);
    }
}
