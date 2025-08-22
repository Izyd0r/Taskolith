using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.OrganizationManagement.Roles.Responses;
using Taskolith.API.Roles.Responses;

namespace Taskolith.API.Roles;

public class GetRoles : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/roles", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get all roles in an organisation");

    private static async Task<IResult> Handle(
        Guid organisationId, 
        AppDbContext dbContext, 
        ClaimsPrincipal claims, 
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var roles = await dbContext.Roles
            .Where(r => r.OrganisationId == organisationId)
            .ToListAsync(cancellationToken: ct);
        var mappedRoles = roles.Select(role => new RoleDto(role.Id, role.OrganisationId, role.Name, role.Permissions)).ToList();
        var response = new GetRolesResponse(mappedRoles);
        
        return Results.Ok(response);
    }
}