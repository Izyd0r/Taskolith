using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.Tasks;

public class CreateTask : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("", Handle)
        .WithRequestValidation<CreateTaskRequest>()
        .RequireAuthorization("CreateTask")
        .WithSummary("Create a new task");

    static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid kanbanColumnId,
        CreateTaskRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var creationTime = DateTime.UtcNow;
        
        var assignedMembers = await dbContext.OrganisationMembers
            .Include(m => m.User)
            .Where(m => request.AssignedMembers.Contains(m.Id))
            .ToListAsync(ct);
        
        var task = new ToDoTask() {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            KanbanColumnId = kanbanColumnId,
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            CreatedDate = creationTime,
            IsCompleted = false,
            AssignedMembers = assignedMembers,
            Order = request.Order,
            Priority = request.Priority,
            Project = await dbContext.Projects.SingleAsync(p => p.Id == projectId, cancellationToken: ct),
            KanbanColumn = await dbContext.KanbanColumns.SingleAsync(c => c.Id == kanbanColumnId, cancellationToken: ct)
        };
        
        await dbContext.ToDoTasks.AddAsync(task, ct);
        await dbContext.SaveChangesAsync(ct);

        var membershipDtos = assignedMembers.Select(m =>
            new MembershipDto(m.Id, m.UserId, m.OrganisationId, m.User.Username, m.User.Email))
            .ToList();
        
        var response = new CreateTaskResponse(
            task.Id,
            task.ProjectId,
            task.KanbanColumnId,
            task.Title,
            task.Description,
            task.DueDate,
            task.CreatedDate,
            task.IsCompleted,
            task.Priority,
            membershipDtos,
            task.Order
        );

        return Results.Created($"/api/organisations/{organisationId}/projects/{projectId}/columns/{kanbanColumnId}/tasks/{task.Id}", response);
    }
}