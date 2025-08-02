using Taskolith.API.Data.Types;

namespace Taskolith.API.Data.Dtos;

public record TaskDto(
    Guid TaskId,
    string Title,
    string Description,
    int Order,
    DateTime DueDate,
    DateTime CreatedDate,
    bool Completed,
    ICollection<MembershipDto> AssignedMembers,
    Priority Priority
);
