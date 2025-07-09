using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

// TODO: add the possibility to archive projects

public class Project {
    public required Guid Id { get; init; }
    public required Guid OrganisationId { get; init; }
    [MaxLength(50)]
    public required string Name { get; set; } = null!;
    [MaxLength(100)]
    public string? Description { get; set; }
    public ICollection<Membership> Members { get; set; } = new List<Membership>();
    public Organisation? Organisation { get; set; }
    public ICollection<ToDoTask> Tasks { get; set; } = new List<ToDoTask>();
    public ICollection<KanbanColumn> KanbanColumns { get; set; } = new List<KanbanColumn>();
}