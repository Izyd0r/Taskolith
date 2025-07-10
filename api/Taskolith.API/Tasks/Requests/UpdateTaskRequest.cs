using Taskolith.API.Data.Types;

namespace Taskolith.API.Tasks.Requests;

public class UpdateTaskRequest {
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? DueDate { get; init; }
    public int? Order { get; init; }
    public Priority? Priority { get; init; }
    public bool? IsCompleted { get; init; }
    public Guid? KanbanColumnId { get; init; }
};