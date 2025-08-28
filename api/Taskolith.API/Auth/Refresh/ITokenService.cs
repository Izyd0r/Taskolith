using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth.Refresh;

public interface ITokenService
{
    Task<(string AccessToken, RefreshToken RefreshToken)> GenerateTokensAsync(User user, CancellationToken ct);
    Task<(string? AccessToken, RefreshToken? RefreshToken)> RefreshTokensAsync(string refreshTokenValue, CancellationToken ct);
}