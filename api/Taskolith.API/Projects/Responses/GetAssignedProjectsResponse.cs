namespace Taskolith.API.Projects.Responses;

public record GetAssignedProjectsResponse(
    Guid ProjectId,
    string ProjectName,
    string ProjectDescription
);