namespace Taskolith.API.Data.Types;

public class Membership {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid OrganisationId { get; set; }
    public required User User { get; set; }
    public required Organisation Organisation { get; init; }
    public ICollection<Role> Roles { get; init; } = new List<Role>();
}
