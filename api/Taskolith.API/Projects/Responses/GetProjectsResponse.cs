namespace Taskolith.API.Projects.Responses;

public record GetProjectsResponse(
    Guid ProjectId,
    string ProjectName,
    string ProjectDescription
);