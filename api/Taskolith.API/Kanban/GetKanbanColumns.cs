using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Kanban.Responses;

namespace Taskolith.API.Kanban;

public class GetKanbanColumns : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("",Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get kanban columns");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var columns = await dbContext.KanbanColumns
            .Where(c => c.ProjectId == projectId)
            .Include(c => c.Tasks)
            .ThenInclude(t => t.AssignedMembers)
            .Select(c => new GetKanbanColumnResponse(
                c.Id,
                c.Name,
                c.Order,
                c.Tasks.Select(t => new TaskDto(
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Order,
                    t.DueDate,
                    t.CreatedDate,
                    t.IsCompleted,
                    t.AssignedMembers.Select(m => new MembershipDto(
                        m.Id,
                        m.UserId,
                        m.OrganisationId,
                        m.User.Username,
                        m.User.Email
                    )).ToList()
                )).ToList()))
            .ToListAsync(ct);
        
        return Results.Ok(columns);
    }
}