using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class ToDoTask
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    [MaxLength(256)]
    public required string Title { get; set; }
    [MaxLength(1024)]
    public required string Description { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedDate { get; init; }
    public bool IsCompleted { get; set; }
    public required Project Project { get; init; }
    public ICollection<Membership> Members { get; init; } = new List<Membership>(); 
}