using Taskolith.API.Data.Types;

namespace Taskolith.API.Data.Dtos;

public record TaskDtoCore(
    Guid TaskId,
    string Title,
    string Description,
    DateTime DueDate,
    DateTime CreatedDate,
    Priority Priority
);

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

public record TaskDtoWithOrganisation(
    TaskDtoCore Task,
    Guid OrganisationId,
    string OrganisationName
);