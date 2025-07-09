namespace Taskolith.API.Kanban.Requests;

public record ChangeOrderKanbanColumnRequest(
    Guid ColumnId,
    int Order
);