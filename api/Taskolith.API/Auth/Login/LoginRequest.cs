namespace Taskolith.API.Auth.Login;

public record LoginRequest(
    string Username,
    string Password
);