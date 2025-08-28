using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Taskolith.API.Auth.Refresh;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.Auth.Login;

public class LoginUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/login", Handle)
            .WithRequestValidation<LoginRequest>()
            .WithSummary("Authenticate a user (login)");

    static async Task<IResult> Handle(
        LoginRequest request,
        AppDbContext db,
        ITokenService tokenService,
        HttpResponse response,
        IOptions<JwtOptions> jwtOptions,
        CancellationToken ct,
        IPasswordHasher<User> passwordHasher)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == request.Username, ct);
        if (user is null)
            return Results.Unauthorized();

        var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Results.Unauthorized();

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
            Expires = refreshToken.Expires,
            Path = "/"
        });

        var loginResponse = new LoginResponse(user.Username, user.Id);
        return Results.Ok(loginResponse);
    }
}