using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Organisations;

public class DeleteOrganisation : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{organisationId:guid}", Handle)
        .RequireAuthorization("DeleteOrganisation")
        .WithSummary("Deletes organisation");

    static async Task<IResult> Handle(
        Guid organisationId,
        AppDbContext db,
        ClaimsPrincipal user, 
        CancellationToken token,
        PermissionService permissionService) {
        var userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();

        var org = await db.Organisations.FindAsync([organisationId], cancellationToken: token);
        if (org is null) return Results.NotFound();
        
        var hasPermission = await permissionService.HasPermission(Guid.Parse(userId), organisationId, Permission.DeleteOrganisation); 
        if (!hasPermission) return Results.Forbid();
        
        var deletedRows = await db.Organisations.Where(o => o.Id == organisationId).ExecuteDeleteAsync(cancellationToken: token);
        return deletedRows == 1 ? Results.NoContent() : Results.NotFound();
    }
}