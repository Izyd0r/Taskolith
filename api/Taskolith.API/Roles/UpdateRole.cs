using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.Roles.Requests;

namespace Taskolith.API.Roles;

public class UpdateRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/roles/{roleId:guid}", Handle)
        .RequireAuthorization("UpdateRole")
        .WithRequestValidation<UpdateRoleRequest>()
        .WithSummary("Update a role");

    private static async Task<IResult> Handle(
        Guid organisationId, 
        Guid roleId, 
        UpdateRoleRequest request, 
        AppDbContext dbContext, 
        ClaimsPrincipal claims, 
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        
        var role = await dbContext.Roles.FindAsync([roleId], cancellationToken: ct);
        if (role == null) return Results.NotFound();
        if (role.Name is DefaultRoles.Admin) return Results.BadRequest("You can't update admin role");
        dbContext.Entry(role).State = EntityState.Modified;
        role.Name=request.Name;
        role.Permissions=request.Permissions;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.Ok();
    }
}