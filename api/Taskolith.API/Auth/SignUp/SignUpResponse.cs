namespace Taskolith.API.Auth.SignUp;

public record SignUpResponse(
    Guid Id,
    string Username,
    string FirstName,
    string LastName,
    string Email,
    string Token
);