using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.OrganizationManagement.InviteSystem.InviteMember;

public class InviteMember : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{organisationId:guid}/invitations", Handle)
        .WithRequestValidation<InviteMemberRequest>()
        .WithSummary("Invites a user to join the organisation");

    private static async Task<IResult> Handle(Guid organisationId, InviteMemberRequest request, AppDbContext dbContext,
        ClaimsPrincipal claims, CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value; 
        if (userId == null) return Results.BadRequest();
        
        // TODO: for now only admins can invite, but in the future i should have role-based permissions system
        var isUserAdmin = await dbContext.OrganisationMembers
            .Where(x => x.UserId == Guid.Parse(userId) && x.OrganisationId == organisationId)
            .SelectMany(x => x.Roles)
            .FirstOrDefaultAsync(r => r.Name == "Admin", cancellationToken: token);
        if (isUserAdmin == null) return Results.BadRequest();

        var invitedUser = await dbContext.Users
            .Where(u => u.Email == request.Email)
            .SingleOrDefaultAsync(token);
        if (invitedUser == null || invitedUser.Id == Guid.Parse(userId)) return Results.BadRequest();
        
        var invitation = new Invitation {
            Id = Guid.NewGuid(),
            UserId = invitedUser.Id,
            OrganisationId = organisationId,
            DueDate = request.DueDate
        };
        
        await dbContext.Invitations.AddAsync(invitation, token);
        await dbContext.SaveChangesAsync(token);
        
        var invitationResponse = new InviteMemberResponse(invitation.Id, request.Email,organisationId,request.DueDate,"Pending");
        
        return Results.Created($"/api/organisations/{organisationId}/invitations", invitationResponse);
    }
}