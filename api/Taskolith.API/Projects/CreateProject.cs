using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.Projects;

public class CreateProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithRequestValidation<CreateProjectRequest>()
        .RequireAuthorization("CreateProject")
        .WithSummary("Creates a new project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        CreateProjectRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();

        var project = new Project() {
            Id = Guid.NewGuid(),
            OrganisationId = organisationId,
            Name = request.Name,
            Description = request.Description,
        };
        
        await dbContext.Projects.AddAsync(project, ct);
        await dbContext.SaveChangesAsync(ct);

        var respone = new CreateProjectResponse(project.Id);
        
        return Results.Created($"/api/organisations/{organisationId}/projects/{project.Id}", respone);
    }
}