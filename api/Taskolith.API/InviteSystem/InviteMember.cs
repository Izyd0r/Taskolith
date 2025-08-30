using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.InviteSystem.Requests;
using Taskolith.API.InviteSystem.Responses;

namespace Taskolith.API.InviteSystem;

public class InviteMember : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{organisationId:guid}/invitations", Handle)
        .WithRequestValidation<InviteMemberRequest>()
        .RequireAuthorization("InviteMember")
        .WithSummary("Invite a user to join an organisation");

    private static async Task<IResult> Handle(Guid organisationId, InviteMemberRequest request, AppDbContext dbContext,
        ClaimsPrincipal claims, CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value; 
        if (userId == null) return Results.BadRequest();

        var invitedUser = await dbContext.Users
            .Where(u => u.Email == request.Email)
            .SingleOrDefaultAsync(token);
        if (invitedUser == null || invitedUser.Id == Guid.Parse(userId)) return Results.BadRequest();
       
        var rolesToAssign = new List<Role>();

        if(request.InitialRoles != null && request.InitialRoles.Any())
        {
            var requestedRoleIds = request.InitialRoles.Select(r => r.Id).ToList();

            rolesToAssign = await dbContext.Roles
                .Where(r => r.OrganisationId == organisationId && requestedRoleIds.Contains(r.Id))
                .ToListAsync(token);
            
            if (rolesToAssign.Count != requestedRoleIds.Count)
            {
                return Results.BadRequest("One or more provided roles are invalid or do not belong to this organisation.");
            }
        }

        var invitation = new Invitation {
            Id = Guid.NewGuid(),
            UserId = invitedUser.Id,
            OrganisationId = organisationId,
            DueDate = request.DueDate,
            Email = request.Email,
            InitialRoles = rolesToAssign
        };
        
        await dbContext.Invitations.AddAsync(invitation, token);
        await dbContext.SaveChangesAsync(token);
        
        var invitationResponse = new InviteMemberResponse(invitation.Id, request.Email,organisationId,request.DueDate,"Pending");
        
        return Results.Created($"/api/organisations/{organisationId}/invitations", invitationResponse);
    }
}
