using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Members;

public class RemoveMemberRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/members/{memberId:guid}/roles/{roleId:guid}", Handle)
        .RequireAuthorization("RemoveRole")
        .WithSummary("Remove a role from a member");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid memberId,
        Guid roleId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        var userId = claims.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var member = dbContext.OrganisationMembers
            .Include(membership => membership.Roles)
            .FirstOrDefault(m => m.Id == memberId && m.OrganisationId == organisationId);
        if (member is null) return Results.NotFound();
        
        dbContext.Entry(member).State = EntityState.Modified;
        var roleToRemove = await dbContext.Roles.FirstOrDefaultAsync(r => r.Id == roleId, cancellationToken: ct);
        if (roleToRemove is null) return Results.NotFound();
        if (roleToRemove.Name == DefaultRoles.Admin) return Results.BadRequest("You cannot remove admin role");
        
        member.Roles.Remove(roleToRemove);
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}