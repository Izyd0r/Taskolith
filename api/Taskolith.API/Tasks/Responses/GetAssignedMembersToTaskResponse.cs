using Taskolith.API.Data.Dtos;

namespace Taskolith.API.Tasks.Responses;

public record GetAssignedMembersToTaskResponse(
    List<MembershipDto> Members
);