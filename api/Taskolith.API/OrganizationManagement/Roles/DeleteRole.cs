using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.OrganizationManagement.Roles;

public class DeleteRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{roleId:guid}", Handle)
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
        if (role.Name=="Admin") return Results.BadRequest();
        dbContext.Entry(role).State = EntityState.Deleted;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}