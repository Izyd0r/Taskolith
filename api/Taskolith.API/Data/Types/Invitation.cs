namespace Taskolith.API.Data.Types;

public enum InvitationStatus {
    Pending,
    Accepted,
    Rejected
}

public class Invitation {
    public Guid Id;
    public Guid OrganisationId;
    public Guid UserId;
    public required string Email;
    public InvitationStatus Status = InvitationStatus.Pending;
    
    private DateTime _dueDate;
    public DateTime DueDate
    {
        get => _dueDate;
        set
        {
            if (value < DateTime.UtcNow)
                throw new ArgumentException("DueDate cannot be in the past.");

            _dueDate = value;
        }
    }
    public bool Expired => DueDate < DateTime.UtcNow;
    public Organisation Organisation { get; init; }
    public User User { get; init; }
}