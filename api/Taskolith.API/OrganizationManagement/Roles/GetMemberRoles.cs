using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.OrganizationManagement.Roles;

public class GetMemberRoles : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{organisationId:guid}/members/{memberId:guid}/roles/", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get member roles");

    private static async Task<IResult> Handle(
        Guid organisationId, 
        Guid memberId, 
        AppDbContext dbContext, 
        ClaimsPrincipal claims, 
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var member = await dbContext.OrganisationMembers.Include(membership => membership.Roles)
            .FirstOrDefaultAsync(m => m.Id == memberId && m.OrganisationId == organisationId, cancellationToken: ct);
        if (member is null) return Results.NotFound();
        
        var mappedRoles = member.Roles.Select(role => new RoleDto(role.Id, role.OrganisationId, role.Name, role.Permissions));
        var response = new GetMemberRolesResponse(mappedRoles.ToList());
        
        return Results.Ok(response);
    }
}