using Taskolith.API.Auth.Login;
using Taskolith.API.Auth.Logout;
using Taskolith.API.Auth.Refresh.cs;
using Taskolith.API.Auth.SignUp;
using Taskolith.API.Common;
using Taskolith.API.Data.Types;
using Taskolith.API.InviteSystem;
using Taskolith.API.Kanban;
using Taskolith.API.Members;
using Taskolith.API.Organisations;
using Taskolith.API.InviteSystem;
using Taskolith.API.Members;
using Taskolith.API.Organisations;
using Taskolith.API.Roles;
using Taskolith.API.Projects;
using Taskolith.API.Roles;
using Taskolith.API.Tasks;

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
        endpoints.MapProjectEndpoints();
        endpoints.MapInvitationEndpoints();
        endpoints.MapKanbanEndpoints();
        endpoints.MapTasksEndpoints();
        endpoints.MapRolesEndpoints();

    }

    private static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/auth")
            .WithTags("Authentication");

        endpoints.MapPublicGroup()
            .MapEndpoint<SignUpUser>()
            .MapEndpoint<LoginUser>()
            .MapEndpoint<Logout>()
            .MapEndpoint<Refresh>();
    }

    private static void MapTasksEndpoints(this IEndpointRouteBuilder app)
    {
        var tasks = app.MapGroup("").WithTags("Tasks");
        
        var myTasks = tasks.MapGroup("/tasks/my-tasks");
        myTasks.MapPrivateGroup().MapEndpoint<GetAllAssignedTasks>();
        
        var endpoints = tasks.MapGroup("/organisations/{organisationId:guid}/projects/{projectId:guid}");
        
        var tasksManagement = endpoints.MapGroup("/tasks");
        tasksManagement.MapPrivateGroup()
            .MapEndpoint<GetTasks>()
            .MapEndpoint<AssignTask>()
            .MapEndpoint<RemoveFromTask>()
            .MapEndpoint<GetAssignedMembersToTask>();

        var kanbanTasks = endpoints.MapGroup("/columns/{kanbanColumnId:guid}/tasks");
        kanbanTasks.MapPrivateGroup()
            .MapEndpoint<CreateTask>()
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
            .MapEndpoint<GetOrganisationMembers>();
    }

    private static void MapProjectEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/organisations/{organisationId:guid}/projects")
            .WithTags("Projects");

        endpoints.MapPrivateGroup()
            .MapEndpoint<CreateProject>()
            .MapEndpoint<GetProjects>()
            .MapEndpoint<UpdateProject>()
            .MapEndpoint<GetAssignedProjects>()
            .MapEndpoint<AssignProject>()
            .MapEndpoint<RemoveFromProject>()
            .MapEndpoint<DeleteProject>()
            .MapEndpoint<GetMembersInsideProject>(); 
    }

    private static void MapKanbanEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/organisations/{organisationId:guid}/projects/{projectId:guid}/columns")
            .WithTags("Kanban columns");

        endpoints.MapPrivateGroup()
            .MapEndpoint<CreateKanbanColumn>()
            .MapEndpoint<UpdateKanbanColumn>()
            .MapEndpoint<DeleteKanbanColumn>()
            .MapEndpoint<GetKanbanColumns>()
            .MapEndpoint<ChangeOrderKanbanColumn>();
    }

    private static void MapInvitationEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("")
            .WithTags("Invitations");

        endpoints.MapPrivateGroup()
            .MapEndpoint<GetInvites>()
            .MapEndpoint<AcceptInvite>()
            .MapEndpoint<RejectInvite>()
            .MapEndpoint<GetInvitesOrganisation>();
    }

    private static void MapRolesEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/organisations/{organisationId:guid}")
            .WithTags("Roles");
        
        endpoints.MapPrivateGroup()
            .MapEndpoint<CreateRole>()
            .MapEndpoint<DeleteRole>()
            .MapEndpoint<GetRoles>()
            .MapEndpoint<UpdateRole>()
            .MapEndpoint<AddMemberRole>()
            .MapEndpoint<RemoveMemberRole>()
            .MapEndpoint<GetMemberRoles>();
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