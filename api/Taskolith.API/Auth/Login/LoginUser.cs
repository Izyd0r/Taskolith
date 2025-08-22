using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;

namespace Taskolith.API.Auth.Login;

public class LoginUser : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/login", Handle)
        .WithRequestValidation<LoginRequest>()
        .WithSummary("Authenticate a user (login)");

    static async Task<IResult> Handle(LoginRequest request, AppDbContext dbContext, JwtTokenGenerator jwtTokenGenerator, CancellationToken token)
    {
        // TODO: Add passwordHasher
       var user = await dbContext.Users
           .FirstOrDefaultAsync(u=>u.Username == request.Username && u.Password == request.Password, cancellationToken: token);
       if (user is null || user.Password != request.Password)
       {
           return Results.Unauthorized();
       }

       var loginResponse = new LoginResponse(jwtTokenGenerator.GenerateToken(user), user.Username, user.Id);
       
       return Results.Ok(loginResponse);
    }
}
