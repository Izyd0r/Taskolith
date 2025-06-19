using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class User
{
    public Guid Id { get; init; }
    [MaxLength(20)]
    public required string Username { get; init; } = null!;
    [MaxLength(100)]
    public required string Password { get; init; } = null!;
    [MaxLength(256)]
    public required string Email { get; init; } = null!;
    [MaxLength(20)]
    public required string FirstName { get; init; } = null!;
    [MaxLength(20)]
    public required string LastName { get; init; } = null!;
    
    public ICollection<ToDoTask> Tasks { get; init; } = new List<ToDoTask>();
}