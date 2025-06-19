namespace Taskolith.API.Tasks.CreateTask;

public record CreateTaskRequest (
    string Title,
    string Description,
    DateTime DueDate
);