using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.InviteSystem;

public class AcceptInvite : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/invitations/{invitationId:guid}/accept", Handle)
        .WithSummary("Accept invite");
    private static async Task<IResult> Handle(Guid invitationId, AppDbContext dbContext, ClaimsPrincipal claims ,CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if(userId == null) return Results.BadRequest("Invalid user identifier");
        
        var invitation = await dbContext.Invitations
            .Include(i => i.InitialRoles)
            .SingleAsync(i => i.Id == invitationId, cancellationToken: token);

        if(invitation.Expired) return Results.BadRequest("Invitation has expired");
        invitation.Status = InvitationStatus.Accepted;
        await dbContext.SaveChangesAsync(token);

        var memberRole = await dbContext.Roles
            .SingleAsync(r => r.OrganisationId == invitation.OrganisationId && r.Name == DefaultRoles.Member,
                cancellationToken: token);

        var membership = new Membership {
            UserId = Guid.Parse(userId),
            User = await dbContext.Users.SingleAsync(u => u.Id == Guid.Parse(userId), cancellationToken: token),
            OrganisationId = invitation.OrganisationId,
            Roles = invitation.InitialRoles.Count != 0
                ? invitation.InitialRoles
                : new List<Role> { memberRole }
        };

        dbContext.Add(membership);
        await dbContext.SaveChangesAsync(token);
        
        return Results.Ok();
    }
}