using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.Auth.SignUp;

public abstract class SignUpUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/register", Handle)
        .WithRequestValidation<SignUpRequest>()
        .WithSummary("Register a new user");
    
    static async Task<IResult> Handle(
        SignUpRequest request,
        HttpResponse response,
        AppDbContext dbContext,
        JwtTokenGenerator jwtTokenGenerator,
        IOptions<JwtOptions> jwtOptions,
        CancellationToken ct,
        IPasswordHasher<User> passwordHasher
        ) {
        if (await dbContext.Users.AnyAsync(u => u.Email == request.Email, cancellationToken: ct))
        {
            return Results.Conflict("Email already exists.");
        }

        if (await dbContext.Users.AnyAsync(u => u.Username == request.Username, cancellationToken: ct))
        {
            return Results.Conflict("Username is already taken.");
        }
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
        user.Password = passwordHasher.HashPassword(user, request.Password);
       
        var jwt = jwtTokenGenerator.GenerateToken(user);

        var refreshToken = new RefreshToken {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = JwtTokenGenerator.GenerateRefreshToken(),
            IsActive = true,
            Created = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        
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
        
        dbContext.Users.Add(user);
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(ct);
        var signUpResponse = new SignUpResponse(
            user.Id,
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email
        );
        
        return Results.Created($"/api/users/{signUpResponse.Id}", signUpResponse);
    }
}
