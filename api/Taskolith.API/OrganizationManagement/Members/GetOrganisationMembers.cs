using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.OrganizationManagement.Members.Responses;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.OrganizationManagement.Members;

public class GetOrganisationMembers : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{organisationId:guid}/members", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get organisation members");

    private static async Task<IResult> Handle(
        Guid organisationId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var members = await dbContext.OrganisationMembers
            .Where(m => m.OrganisationId == organisationId)
            .Select(m => new GetOrganisationMembersResponse(
                m.Id,
                m.UserId,
                m.OrganisationId,
                m.Roles.Select(r => new RoleDto(r.Id, r.OrganisationId, r.Name, r.Permissions)).ToList()
            ))
            .ToListAsync(cancellationToken: ct);
        
        return Results.Ok(members); 
    }
}