using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Data.Dtos;
using Taskolith.API.InviteSystem.Responses;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.InviteSystem;

public class GetInvitesOrganisation : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/organisations/{organisationId:guid}/invitations", Handle)
        .RequireAuthorization("InviteMember") // need to think about this
        .WithSummary("Get all pending invitations for an organisation");

    private static async Task<IResult> Handle(
        Guid organisationId, 
        AppDbContext db, 
        ClaimsPrincipal claims, 
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        var invites = await db.Invitations
            .Include(i => i.Organisation)
            .Where(i => i.OrganisationId == organisationId && i.Status == InvitationStatus.Pending)
            .Select(i => new InvitationDto(
                    i.Id,
                    i.OrganisationId,
                    i.Organisation.Name,
                    Enum.GetName(i.Status) ?? string.Empty,
                    i.DueDate,
                    i.Expired,
                    i.Email,
                    i.InitialRoles.Select(role => new RoleDto(
                        role.Id,
                        role.OrganisationId,
                        role.Name,
                        role.Permissions
                    )).ToList()
                )
            )
            .ToListAsync(cancellationToken: ct);
        var response = new GetInvitesOrganisationResponse(invites);
        return Results.Ok(response);
    }
}
