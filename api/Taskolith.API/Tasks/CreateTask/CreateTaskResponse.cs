namespace Taskolith.API.Tasks.CreateTask;

public record CreateTaskResponse(
    Guid UserId,
    Guid TaskId,
    string Title,
    string Description,
    DateTime DueDate,
    bool Completed,
    DateTime Created
);