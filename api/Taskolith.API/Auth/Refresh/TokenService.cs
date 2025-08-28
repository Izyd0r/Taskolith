using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth.Refresh;

public class TokenService(AppDbContext db, JwtTokenGenerator jwt) : ITokenService
{
    public async Task<(string AccessToken, RefreshToken RefreshToken)> GenerateTokensAsync(User user, CancellationToken ct)
    {
        var accessToken = jwt.GenerateToken(user);
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = JwtTokenGenerator.GenerateRefreshToken(),
            IsActive = true,
            Created = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        db.RefreshTokens.Add(refreshToken);
        await db.SaveChangesAsync(ct);

        return (accessToken, refreshToken);
    }

    public async Task<(string? AccessToken, RefreshToken? RefreshToken)> RefreshTokensAsync(string refreshTokenValue, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(refreshTokenValue)) return (null, null);

        var refreshTokenEntity = await db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue, ct);

        if (refreshTokenEntity == null || refreshTokenEntity.Expires < DateTime.UtcNow)
            return (null, null);

        if (!refreshTokenEntity.IsActive)
        {
            var activeTokens = await db.RefreshTokens
                .Where(rt => rt.UserId == refreshTokenEntity.UserId && rt.IsActive)
                .ToListAsync(ct);
            activeTokens.ForEach(rt => rt.IsActive = false);
            await db.SaveChangesAsync(ct);
            return (null, null);
        }

        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        try
        {
            refreshTokenEntity.IsActive = false;

            var newRefreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = refreshTokenEntity.UserId,
                Token = JwtTokenGenerator.GenerateRefreshToken(),
                IsActive = true,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            db.RefreshTokens.Add(newRefreshToken);

            var newAccessToken = jwt.GenerateToken(refreshTokenEntity.User);

            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            return (newAccessToken, newRefreshToken);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            return (null, null);
        }
    }
}