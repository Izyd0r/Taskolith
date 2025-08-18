using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Members.Responses;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.Members;

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
    
        // Temp fix
        var membersFromDb = await dbContext.OrganisationMembers
            .Where(m => m.OrganisationId == organisationId)
            .Include(m => m.User)
            .Include(m => m.Roles)
            .ToListAsync(cancellationToken: ct);

        var response = membersFromDb.Select(member => 
            new GetOrganisationMembersResponse(
                new MembershipDto(
                    member.Id,
                    member.UserId,
                    member.OrganisationId,
                    member.User.Username,
                    member.User.Email
                ),
                member.Roles.Select(role => new RoleDto(
                    role.Id,
                    role.OrganisationId,
                    role.Name,
                    role.Permissions
                )).ToList()
            )
        ).ToList();
        return Results.Ok(response); 
    }
}
