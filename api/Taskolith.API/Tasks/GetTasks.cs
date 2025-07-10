using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.Tasks;

public class GetTasks : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get all tasks that are assigned to the member");

    static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();

        var me = await dbContext.OrganisationMembers.FirstOrDefaultAsync(
            m => m.OrganisationId == organisationId && m.UserId == Guid.Parse(userId), cancellationToken: ct);
        if (me == null) return Results.BadRequest();
        
        var tasks = await dbContext.ToDoTasks
            .Where(t => t.ProjectId == projectId && t.AssignedMembers.Any(m => m.Id == me.Id))
            .Select(t => new TaskDto(
                t.Id,
                t.Title,
                t.Description,
                t.Order,
                t.DueDate,
                t.CreatedDate,
                t.IsCompleted,
                t.AssignedMembers.Select(am => new MembershipDto(
                    am.Id,
                    am.UserId,
                    am.OrganisationId,
                    am.User.Username,
                    am.User.Email
                )).ToList()
            ))
            .ToListAsync(ct);
        
        var response = new GetTasksResponse(tasks);
        return Results.Ok(response);
    }
}