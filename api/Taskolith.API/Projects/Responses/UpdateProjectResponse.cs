namespace Taskolith.API.Projects.Responses;

public record UpdateProjectResponse(
    string ProjectName,
    string ProjectDescription
);