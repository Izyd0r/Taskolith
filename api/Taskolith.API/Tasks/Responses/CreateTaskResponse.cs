using Taskolith.API.Data.Dtos;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Tasks.Responses;

public record CreateTaskResponse(
    Guid TaskId,
    Guid ProjectId,
    Guid KanbanColumnId,
    string Title,
    string Description,
    DateTime DueDate,
    DateTime Created,
    bool Completed,
    Priority Priority,
    ICollection<MembershipDto> AssignedMembers,
    int Order
);