namespace Taskolith.API.Auth.Status;

public record GetStatusResponse(
    Guid UserId,
    string Email,
    string Username
);