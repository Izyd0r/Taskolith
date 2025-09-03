using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class User {
    public Guid Id { get; init; }
    [MaxLength(20)]
    public required string Username { get; set; } = null!;
    [MaxLength(100)]
    public string Password { get; set; } = null!;
    [MaxLength(256)]
    public required string Email { get; set; } = null!;
    [MaxLength(20)]
    public required string FirstName { get; set; } = null!;
    [MaxLength(20)]
    public required string LastName { get; set; } = null!;
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}