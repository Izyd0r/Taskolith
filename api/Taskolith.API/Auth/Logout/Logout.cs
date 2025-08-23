using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Auth.Logout;

public class Logout : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/logout", Handle)
        .WithSummary("Logout a user");

    private static async Task<IResult> Handle(HttpRequest request, HttpResponse response, AppDbContext db, CancellationToken ct) {
        var refreshToken = request.Cookies["refresh_token"];
        if (!string.IsNullOrEmpty(refreshToken)) {
            var refreshTokenEntity = await db.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.IsActive, ct);

            if (refreshTokenEntity != null) {
                refreshTokenEntity.IsActive = false;
                await db.SaveChangesAsync(ct);
            }
        }

        response.Cookies.Delete("access_token");
        response.Cookies.Delete("refresh_token");

        return Results.NoContent();
    }
}