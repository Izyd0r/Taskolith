using Taskolith.API.Auth;
using Taskolith.API.Auth.Login;
using Taskolith.API.Auth.SignUp;
using Taskolith.API.Common;
using Taskolith.API.Tasks.CreateTask;
using Taskolith.API.Tasks.GetTasks;

namespace Taskolith.API;

public static class Endpoints
{
    public static void MapEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("/api")
            .WithOpenApi();
       
        // Here we map groups of endpoints
        endpoints.MapAuthEndpoints();
        endpoints.MapTasksEndpoints();
    }

    private static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/auth")
            .WithTags("Authentication");

        endpoints.MapPublicGroup()
            .MapEndpoint<SignUpUser>()
            .MapEndpoint<LoginUser>();
    }

    private static void MapTasksEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/tasks")
            .WithTags("Tasks");

        endpoints.MapPrivateGroup()
            .MapEndpoint<CreateTask>()
            .MapEndpoint<GetTasks>();
    }
    
    private static RouteGroupBuilder MapPublicGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .AllowAnonymous();
    }
    
    private static RouteGroupBuilder MapPrivateGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .RequireAuthorization();
    }
    
    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app) where TEndpoint : IEndPoint
    {
        TEndpoint.Map(app);
        return app;
    }
}