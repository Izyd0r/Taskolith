using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.Tasks;

public class GetAssignedMembersToTask : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{taskId}/members", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get members assigned to a task");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid taskId,
        AppDbContext db,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
            
        var members = await db.ToDoTasks
            .Where(t => t.Id == taskId && t.ProjectId == projectId)
            .SelectMany(t => t.AssignedMembers)
            .Select(m => new MembershipDto(
                m.Id,
                m.UserId,
                m.OrganisationId,
                m.User.Username,
                m.User.Email
            ))
            .ToListAsync(ct);
        
        return Results.Ok(new GetAssignedMembersToTaskResponse(members));
    }
}