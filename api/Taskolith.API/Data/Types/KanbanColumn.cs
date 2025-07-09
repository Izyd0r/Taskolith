using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class KanbanColumn {
   public required Guid Id { get; init; }
   public required Guid ProjectId { get; init; }
   [MaxLength(100)]
   public required string Name { get; set; }
   public required int Order { get; set; }
   public ICollection<ToDoTask> Tasks { get; set; } = new List<ToDoTask>();
   public required Project? Project { get; init; }
}