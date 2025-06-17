namespace Taskolith.API.Auth.SignUp;

public record SignUpRequest(
    string Username,
    string Password,
    string Email,
    string FirstName,
    string LastName
);
