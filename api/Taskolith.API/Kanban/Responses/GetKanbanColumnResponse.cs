using Taskolith.API.Data.Dtos;

namespace Taskolith.API.Kanban.Responses;

public record GetKanbanColumnResponse(
    Guid ColumnId,
    string ColumnName,
    int Order,
    ICollection<TaskDto>? Tasks
);