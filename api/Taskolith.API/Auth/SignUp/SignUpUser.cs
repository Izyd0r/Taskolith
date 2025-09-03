using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Taskolith.API.Auth.Refresh;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.Auth.SignUp;

public class SignUpUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/register", Handle)
           .WithRequestValidation<SignUpRequest>()
           .WithSummary("Register a new user");

    private static async Task<IResult> Handle(
        SignUpRequest request,
        AppDbContext db,
        ITokenService tokenService,
        HttpResponse response,
        IOptions<JwtOptions> jwtOptions,
        CancellationToken ct,
        IPasswordHasher<Data.Types.User> passwordHasher
    )
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email, ct))
            return Results.Conflict("Email already exists.");

        if (await db.Users.AnyAsync(u => u.Username == request.Username, ct))
            return Results.Conflict("Username is already taken.");

        var user = new Data.Types.User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
        user.Password = passwordHasher.HashPassword(user, request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        var (accessToken, refreshToken) = await tokenService.GenerateTokensAsync(user, ct);

        response.Cookies.Append("access_token", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(jwtOptions.Value.ExpiryMinutes),
            Path = "/"
        });

        response.Cookies.Append("refresh_token", refreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/"
        });

        var signUpResponse = new SignUpResponse(user.Id, user.Username, user.FirstName, user.LastName, user.Email);
        return Results.Created($"/api/users/{signUpResponse.Id}", signUpResponse);
    }
}