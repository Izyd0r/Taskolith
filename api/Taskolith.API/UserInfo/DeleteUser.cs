using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.UserInfo;

public class DeleteUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/me", Handle)
        .WithSummary("Delete user");

    private static async Task<IResult> Handle(AppDbContext dbContext, ClaimsPrincipal claims, CancellationToken ct)
    {
        var userIdString = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString is null) return Results.BadRequest("User ID claim not found in token.");
        if (!Guid.TryParse(userIdString, out var userId)) return Results.BadRequest("Invalid User ID format in token.");

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null) return Results.NotFound("User not found");
        
        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}