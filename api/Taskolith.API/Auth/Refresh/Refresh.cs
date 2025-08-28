using Microsoft.Extensions.Options;
using Taskolith.API.Common;

namespace Taskolith.API.Auth.Refresh;

public class Refresh : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/refresh", Handle)
            .WithSummary("Refresh access token");

    static async Task<IResult> Handle(HttpRequest request, HttpResponse response, ITokenService tokenService, IOptions<JwtOptions> jwtOptions, CancellationToken ct)
    {
        var refreshTokenValue = request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshTokenValue))
            return Results.Unauthorized();

        var (newAccess, newRefresh) = await tokenService.RefreshTokensAsync(refreshTokenValue, ct);

        if (newAccess == null || newRefresh == null)
            return Results.Unauthorized();

        response.Cookies.Append("access_token", newAccess, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(jwtOptions.Value.ExpiryMinutes),
            Path = "/"
        });

        response.Cookies.Append("refresh_token", newRefresh.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = newRefresh.Expires,
            Path = "/"
        });

        return Results.NoContent();
    }
}
