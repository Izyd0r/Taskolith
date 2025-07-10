namespace Taskolith.API.Tasks.UpdateTask;

public record UpdateTaskRequest(
    Guid TaskId,
    string? Title,
    string? Description,
    DateTime? DueDate,
    bool? Completed
);