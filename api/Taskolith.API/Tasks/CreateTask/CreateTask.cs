using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.Tasks.CreateTask;

public class CreateTask : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Creates a new task")
        .WithRequestValidation<CreateTaskRequest>();

    static async Task<IResult> Handle(CreateTaskRequest request, AppDbContext context, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var value = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (value == null) return Results.BadRequest();
        var taskCreationTime = DateTime.UtcNow;
        var task = new ToDoTask()
        {
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            UserId = Guid.Parse(value),
            IsCompleted = false,
            Id = Guid.NewGuid(),
            CreatedDate = taskCreationTime,
        };
            
        await context.ToDoTasks.AddAsync(task, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
            
        var response = new CreateTaskResponse(task.UserId, task.Id, task.Title, task.Description, task.DueDate, taskCreationTime, task.IsCompleted);
        return Results.Created($"/api/tasks/{task.Id}",response);
    }
}