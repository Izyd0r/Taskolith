using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Taskolith.API.Common;

namespace Taskolith.API.Auth.Status;

public class GetStatus : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/status", Handle)
        .WithSummary("Get user status");
    private static Results<Ok<GetStatusResponse>, BadRequest<string>> Handle(ClaimsPrincipal user)
    {
        string? GetClaim(string claimType, string errorMessage, out string? value)
        {
            value = user.FindFirstValue(claimType);
            return string.IsNullOrEmpty(value) ? errorMessage : null;
        }

        if (GetClaim(ClaimTypes.NameIdentifier, "Token is missing the required 'User ID' (sub) claim.", out var userIdClaim) is { } userIdError)
            return TypedResults.BadRequest(userIdError);

        if (GetClaim(ClaimTypes.Email, "Token is missing the required 'Email' claim.", out var email) is { } emailError)
            return TypedResults.BadRequest(emailError);

        if (GetClaim(ClaimTypes.Name, "Token is missing the required 'Name' claim.", out var username) is { } nameError)
            return TypedResults.BadRequest(nameError);

        if (!Guid.TryParse(userIdClaim, out var userId))
            return TypedResults.BadRequest("Invalid user ID format in token.");

        return TypedResults.Ok(new GetStatusResponse(userId, email!, username!));
    }
}