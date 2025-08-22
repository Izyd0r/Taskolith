using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.InviteSystem;

public class RejectInvite : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/invitations/{invitationId:guid}/reject", Handle)
        .WithSummary("Reject an invitation");
    private static async Task<IResult> Handle(Guid invitationId, AppDbContext dbContext, ClaimsPrincipal claims ,CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if(userId == null) return Results.BadRequest("Invalid user identifier");
        
        var invitation = await dbContext.Invitations.FindAsync([invitationId], cancellationToken: token);
        if(invitation == null) return Results.BadRequest("Invitation not found"); 
       
        if(invitation.Expired) return Results.BadRequest("Invitation has expired");
        invitation.Status = InvitationStatus.Rejected;
        await dbContext.SaveChangesAsync(token);

        return Results.Ok();
    }
}