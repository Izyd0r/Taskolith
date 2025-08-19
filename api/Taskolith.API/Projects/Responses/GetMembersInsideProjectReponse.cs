using Taskolith.API.Data.Dtos;

namespace Taskolith.API.Projects.Responses;

public record GetMembersInsideProjectReponse(
    List<MembershipDto> Members
);