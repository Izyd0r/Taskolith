namespace Taskolith.API.Auth.Refresh;

public class JwtRefreshMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext context, ITokenService tokenService)
    {
        var accessToken = context.Request.Cookies["access_token"];
        var refreshToken = context.Request.Cookies["refresh_token"];

        if (string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
        {
            var (newAccess, newRefresh) = await tokenService.RefreshTokensAsync(refreshToken, CancellationToken.None);

            if (newAccess != null && newRefresh != null)
            {
                context.Response.Cookies.Append("access_token", newAccess, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax, Path = "/" });
                context.Response.Cookies.Append("refresh_token", newRefresh.Token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax, Path = "/" });

                context.Request.Headers["Authorization"] = $"Bearer {newAccess}";
            }
        }

        await next(context);
    }
}