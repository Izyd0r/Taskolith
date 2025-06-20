using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class ToDoTask
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    [MaxLength(256)]
    public required string Title { get; set; }
    [MaxLength(1024)]
    public required string Description { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedDate { get; init; }
    public bool IsCompleted { get; set; }
}