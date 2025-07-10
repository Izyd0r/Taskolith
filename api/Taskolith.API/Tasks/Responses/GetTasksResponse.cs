using Taskolith.API.Data.Dtos;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Tasks.Responses;

public record GetTasksResponse(
    List<TaskDto> Tasks
);