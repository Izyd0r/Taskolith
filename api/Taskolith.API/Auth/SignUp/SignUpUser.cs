using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.Auth.SignUp;

public abstract class SignUpUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/register", Handle)
        .WithRequestValidation<SignUpRequest>()
        .WithDisplayName("Register User");
    
    static async Task<IResult> Handle(SignUpRequest request, AppDbContext dbContext, JwtTokenGenerator jwtTokenGenerator)
    {
        if (await dbContext.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Results.Conflict("Email already exists.");
        }

        if (await dbContext.Users.AnyAsync(u => u.Username == request.Username))
        {
            return Results.Conflict("Username is already taken.");
        }
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = request.Password, // TODO: add bcrypt hash password
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
        
        var refreshToken = new RefreshToken{
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = JwtTokenGenerator.GenerateRefreshToken(),
            IsActive = true,
            Created = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        
        dbContext.Users.Add(user);
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync();
        var signUpResponse = new SignUpResponse(
            user.Id,
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email,
            jwtTokenGenerator.GenerateToken(user),
            refreshToken.Token
        );
        
        return Results.Created($"/api/users/{signUpResponse.Id}", signUpResponse);
    }
}