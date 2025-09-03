namespace Taskolith.API.UserInfo.Requests;

public record UpdateUserRequest(string? Username, string? Email, string? Password);