namespace Taskolith.API.Kanban.Requests;

public record UpdateKanbanColumnRequest(
    Guid ProjectId,
    string Name,
    int Order
);