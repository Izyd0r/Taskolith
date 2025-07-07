using Taskolith.API.Auth.Login;
using Taskolith.API.Auth.SignUp;
using Taskolith.API.Common;
using Taskolith.API.OrganizationManagement.InviteSystem;
using Taskolith.API.OrganizationManagement.InviteSystem.AcceptInvite;
using Taskolith.API.OrganizationManagement.InviteSystem.GetInvites;
using Taskolith.API.OrganizationManagement.InviteSystem.InviteMember;
using Taskolith.API.OrganizationManagement.InviteSystem.RejectInvite;
using Taskolith.API.OrganizationManagement.Members;
using Taskolith.API.OrganizationManagement.Organisations;
using Taskolith.API.OrganizationManagement.Roles;
using Taskolith.API.Tasks.CreateTask;
using Taskolith.API.Tasks.DeleteTask;
using Taskolith.API.Tasks.GetTasks;
using Taskolith.API.Tasks.UpdateTask;

namespace Taskolith.API;

public static class Endpoints
{
    public static void MapEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("/api")
            .WithOpenApi();

        // Here we map groups of endpoints
        endpoints.MapAuthEndpoints();
        endpoints.MapOrganisationManagementEndpoints();
        endpoints.MapInvitationEndpoints();
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
            .MapEndpoint<GetTasks>()
            .MapEndpoint<UpdateTask>()
            .MapEndpoint<DeleteTask>();
    }

    private static void MapOrganisationManagementEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/organisations")
            .WithTags("Organisations");

        endpoints.MapPrivateGroup()
            .MapEndpoint<CreateOrganisation>()
            .MapEndpoint<DeleteOrganisation>()
            .MapEndpoint<UpdateOrganisation>()
            .MapEndpoint<GetUserOrganisations>();
        endpoints.MapPrivateGroup()
            .MapEndpoint<InviteMember>()
            .MapEndpoint<KickMember>();
        endpoints.MapPrivateGroup()
            .MapEndpoint<CreateRole>()
            .MapEndpoint<DeleteRole>()
            .MapEndpoint<GetRoles>()
            .MapEndpoint<UpdateRole>()
            .MapEndpoint<GetMemberRoles>();
        endpoints.MapPrivateGroup()
            .MapEndpoint<GetOrganisationMembers>()
            .MapEndpoint<AddMemberRole>()
            .MapEndpoint<RemoveMemberRole>();
    }

    private static void MapInvitationEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/invitations")
            .WithTags("Invitations");

        endpoints.MapPrivateGroup()
            .MapEndpoint<GetInvites>()
            .MapEndpoint<AcceptInvite>()
            .MapEndpoint<RejectInvite>();
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

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app)
        where TEndpoint : IEndPoint
    {
        TEndpoint.Map(app);
        return app;
    }
}