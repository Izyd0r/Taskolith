using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Roles;

public class DeleteRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/roles/{roleId:guid}", Handle)
        .RequireAuthorization("DeleteRole")
        .WithSummary("Deletes a role");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid roleId, 
        AppDbContext dbContext,
        ClaimsPrincipal claims, 
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        
        var role = await dbContext.Roles.FindAsync([roleId], cancellationToken: ct);
        if (role is null) return Results.NotFound();
        if (role.Name is DefaultRoles.Admin or DefaultRoles.Member) return Results.BadRequest("You can't delete a predefined role");
        dbContext.Entry(role).State = EntityState.Deleted;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}