namespace Taskolith.API.Auth.Login;

public record LoginResponse(
    string Username,
    Guid UserId    
);
