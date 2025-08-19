using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.InviteSystem.Responses;

namespace Taskolith.API.InviteSystem;

public class GetInvitesOrganisation : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/organisations/{organisationId:guid}/invitations", Handle)
        .RequireAuthorization("InviteMember") // need to think about this
        .WithSummary("Gets all pending invites inside an organisation");

    private static async Task<IResult> Handle(
        Guid organisationId, 
        AppDbContext db, 
        ClaimsPrincipal claims, 
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        var invites = await db.Invitations
            .Where(i => i.OrganisationId == organisationId)
            .Select(i => new InvitationDto(
                    i.Id,
                    i.OrganisationId,
                    Enum.GetName(i.Status) ?? string.Empty,
                    i.DueDate,
                    i.Expired,
                    i.Email
                )
            )
            .ToListAsync(cancellationToken: ct);
        var response = new GetInvitesOrganisationResponse(invites);
        return Results.Ok(response);
    }
}