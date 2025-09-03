using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.UserInfo.Requests;
using Taskolith.API.UserInfo.Response;

namespace Taskolith.API.UserInfo;

public class UpdateUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/me", Handle)
        .WithRequestValidation<UpdateUserRequest>()
        .WithSummary("Update user info");

    private static async Task<IResult> Handle(UpdateUserRequest request, AppDbContext dbContext, ClaimsPrincipal claims, IPasswordHasher<Data.Types.User> passwordHasher, CancellationToken ct)
    {
        var userIdString = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString is null) return Results.BadRequest("User ID claim not found in token.");
        if (!Guid.TryParse(userIdString, out var userId)) return Results.BadRequest("Invalid User ID format in token.");

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null) return Results.NotFound("User not found");
        
        if (!string.IsNullOrWhiteSpace(request.Email) && user.Email != request.Email)
        {
            if (await dbContext.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId, ct))
            {
                return Results.Conflict("The new email is already in use.");
            }
            user.Email = request.Email;
        }

        if (!string.IsNullOrWhiteSpace(request.Username) && user.Username != request.Username)
        {
            if (await dbContext.Users.AnyAsync(u => u.Username == request.Username && u.Id != userId, ct))
            {
                return Results.Conflict("The new username is already taken.");
            }
            user.Username = request.Username;
        }

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.Password = passwordHasher.HashPassword(user, request.Password);
        }
        
        await dbContext.SaveChangesAsync(ct);
        
        return Results.Ok(new UpdateUserResponse(user.Username, user.Email));
    } 
}