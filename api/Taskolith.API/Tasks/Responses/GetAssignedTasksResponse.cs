using Taskolith.API.Data.Dtos;

namespace Taskolith.API.Tasks.Responses;

public record GetAssignedTasksResponse(List<TaskDtoWithOrganisation> Tasks);