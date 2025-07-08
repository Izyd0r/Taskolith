using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class Organisation {
    public required Guid Id { get; init; }
    [MaxLength(100)]
    public required string Name { get; set; } = null!;
    public ICollection<Membership> Members { get; set; } = new List<Membership>();
    public ICollection<Role> OrganisationRoles { get; set; } = new List<Role>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
}