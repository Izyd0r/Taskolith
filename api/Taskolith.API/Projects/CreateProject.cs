using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
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

        if (request.MembersIds != null && request.MembersIds.Any()) {
            var members = await dbContext.OrganisationMembers
                .Where(m => request.MembersIds != null && request.MembersIds.Contains(m.Id))
                .ToListAsync(ct);

            foreach (var member in members.Where(member => !project.Members.Contains(member))) {
                project.Members.Add(member);
            }
        }
        await dbContext.SaveChangesAsync(ct);
        
        var response = new CreateProjectResponse(project.Id, project.Name, project.Description ?? string.Empty);
        return Results.Created($"/api/organisations/{organisationId}/projects/{project.Id}", response);
    }
}