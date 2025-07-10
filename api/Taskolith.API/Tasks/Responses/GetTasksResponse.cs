using Taskolith.API.Data.Types;

namespace Taskolith.API.Tasks.GetTasks;

public record GetTasksResponse(
    Guid UserId,
    List<ToDoTask> Tasks
);