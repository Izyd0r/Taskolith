namespace Taskolith.API.Projects.Responses;

public record CreateProjectResponse (
    Guid ProjectId,
    string Name,
    string Description
);