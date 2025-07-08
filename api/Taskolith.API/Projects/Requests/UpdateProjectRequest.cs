namespace Taskolith.API.Projects.Requests;

public record UpdateProjectRequest(
    string Name,
    string Description
);