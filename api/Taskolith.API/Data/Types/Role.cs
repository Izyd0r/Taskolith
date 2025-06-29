using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class Role {
    public required Guid Id { get; init; }
    public required Guid OrganisationId { get; init; }
    [MaxLength(100)]
    public string Name { get; init; } = null!;
    public Organisation Organisation { get; init; } = null!;
    public ICollection<Membership> Members { get; init; } = new List<Membership>();
}