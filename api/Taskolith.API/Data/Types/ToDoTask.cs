using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class ToDoTask {
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public Guid KanbanColumnId { get; set; }
    [MaxLength(256)]
    public required string Title { get; set; }
    [MaxLength(1024)]
    public required string Description { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedDate { get; init; }
    public bool IsCompleted { get; set; }
    public required Project Project { get; init; }
    public required KanbanColumn KanbanColumn { get; set; }
    public ICollection<Membership> AssignedMembers { get; set; } = new List<Membership>();
    public int Order { get; set; }
    public Priority Priority { get; set; }
}