using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.InviteSystem;

public class RevokeInvitation : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{organisationId:guid}/invitations/{invitationId:guid}", Handle)
        .WithSummary("Revoke a pending invitation for an organisation")
        .RequireAuthorization("InviteMember");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid invitationId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct)
    {
        var userIdString = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var currentUserId)) return Results.Unauthorized();

        var member = await dbContext.OrganisationMembers
            .Include(m => m.Roles)
            .FirstOrDefaultAsync(m => m.OrganisationId == organisationId && m.UserId == currentUserId, ct);

        if (member is null) return Results.Forbid();

        var invitation = await dbContext.Invitations
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.OrganisationId == organisationId, ct);

        if (invitation is null) return Results.NotFound("Invitation not found within this organisation.");
        if (invitation.Status != InvitationStatus.Pending) return Results.BadRequest("This invitation cannot be revoked because it is not in a pending state.");
        if (invitation.Expired) return Results.BadRequest("This invitation cannot be revoked because it has already expired.");

        invitation.Status = InvitationStatus.Revoked;
        await dbContext.SaveChangesAsync(ct);

        return Results.NoContent();
    }
}