using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.InviteSystem.GetInvites;

public class GetInvites : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Get all invites");

    private static async Task<IResult> Handle(AppDbContext dbContext, ClaimsPrincipal claims, CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        if (!Guid.TryParse(userId, out var parsedUserId))
            return Results.BadRequest("Invalid user ID.");
        var invites = await dbContext.Invitations
            .Where(i => i.UserId == parsedUserId)
            .Select(i => new InvitationDto(
                    i.Id,
                    i.OrganisationId,
                    Enum.GetName(i.Status) ?? string.Empty,
                    i.DueDate,
                    i.Expired
                )
            )
            .ToListAsync(cancellationToken: token);
        var response = new GetInvitesResponse(invites);
        return Results.Ok(response);
    }
}