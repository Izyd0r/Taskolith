using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.Projects;

public class GetMembersInsideProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{projectId:guid}/members", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Gets all members assigned to a project");

    private static async Task<IResult> Handle(
        Guid projectId,
        AppDbContext db,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var membersInsideOrg = await db.OrganisationMembers
            .Where(m => m.Projects.Any(p => p.Id == projectId))
            .Select(m => new MembershipDto(
                m.Id,
                m.UserId,
                m.OrganisationId,
                m.User.Email,
                m.User.Username
                ))
            .ToListAsync(ct);
         
        return Results.Ok(new GetMembersInsideProjectReponse(membersInsideOrg));
    }
}