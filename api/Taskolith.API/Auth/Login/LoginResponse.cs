namespace Taskolith.API.Auth.Login;

public record LoginResponse(
    string Token,
    string Username,
    Guid userId    
);
