using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
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
    ClaimsPrincipal user,
    CancellationToken ct
    ) {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.BadRequest(new { error = "UserId missing in claims" });

        var members = await dbContext.OrganisationMembers
            .Where(m => m.OrganisationId == organisationId)
            .Include(m => m.User)
            .Include(m => m.Roles)
            .ToListAsync(ct);

        if (!members.Any())
            return Results.Ok(new { members = Array.Empty<GetOrganisationMembersResponse>() });

        var response = members.Select(m => new GetOrganisationMembersResponse(
            new MembershipDto(m.Id, m.UserId, m.OrganisationId, m.User.Username, m.User.Email),
            m.Roles.Select(r => new RoleDto(r.Id, r.OrganisationId, r.Name, r.Permissions)).ToList()
        )).ToList();

        return Results.Ok(new { members = response });
    }
}
