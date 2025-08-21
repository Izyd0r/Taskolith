using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class Role {
    public required Guid Id { get; init; }
    public required Guid OrganisationId { get; init; }
    [MaxLength(100)]
    public string Name { get; set; }
    public Organisation Organisation { get; init; } = null!;
    public ICollection<Membership> Members { get; set; } = new List<Membership>();
    public Permission Permissions { get; set; }
    public ICollection<Invitation> Invites { get; set; } = new List<Invitation>();
}