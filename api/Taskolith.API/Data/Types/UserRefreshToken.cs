using System.ComponentModel.DataAnnotations;

namespace Taskolith.API.Data.Types;

public class RefreshToken
{
    public required Guid Id { get; init; }
    public required Guid UserId { get; init; }
    [MaxLength(200)]
    public required string Token { get; init; }
    public required bool IsActive { get; set; } = true;
    public required DateTime Created { get; init; }
    public required DateTime Expires { get; init; }
}