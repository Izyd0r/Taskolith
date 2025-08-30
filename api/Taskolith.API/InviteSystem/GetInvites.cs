using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Data.Dtos;
using Taskolith.API.InviteSystem.Responses;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.InviteSystem;

public class GetInvites : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/invitations", Handle)
        .WithSummary("Get all invitations");

    private static async Task<IResult> Handle(AppDbContext dbContext, ClaimsPrincipal claims, CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        if (!Guid.TryParse(userId, out var parsedUserId))
            return Results.BadRequest("Invalid user ID.");
        var invites = await dbContext.Invitations
            .Where(i => i.UserId == parsedUserId && i.Status == InvitationStatus.Pending)
            .Select(i => new InvitationDto(
                    i.Id,
                    i.OrganisationId,
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
            .ToListAsync(cancellationToken: token);
        var response = new GetInvitesResponse(invites);
        return Results.Ok(response);
    }
}
