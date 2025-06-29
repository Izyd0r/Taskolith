using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class Organisation {
    public required Guid Id { get; init; }
    [MaxLength(100)]
    public required string Name { get; init; } = null!;
    public ICollection<Membership> Members { get; init; } = new List<Membership>();
    public ICollection<Role> OrganisationRoles { get; init; } = new List<Role>();
}