using Taskolith.API.Data.Dtos;

namespace Taskolith.API.Projects.Requests;

public record CreateProjectRequest(
    string Name,
    string Description,
    List<MembershipDto>? Members = null
);