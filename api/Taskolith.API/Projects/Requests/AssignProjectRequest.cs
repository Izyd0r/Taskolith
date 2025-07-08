namespace Taskolith.API.Projects.Requests;

public record AssignProjectRequest(
    List<Guid> MembersId
);