namespace Taskolith.API.Kanban.Requests;

public record CreateKanbanColumnRequest(
    Guid ProjectId,
    string Name
);