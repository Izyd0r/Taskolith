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
        CancellationToken ct) 
     {
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.BadRequest();
        
        var creatorMember = await dbContext.OrganisationMembers
            .SingleOrDefaultAsync(m => m.UserId == Guid.Parse(userId) && m.OrganisationId == organisationId, ct);

        if (creatorMember is null) {
            return Results.Forbid(); 
        }

        var project = new Project {
            Id = Guid.NewGuid(),
            OrganisationId = organisationId,
            Name = request.Name,
            Description = request.Description,
            Members = [creatorMember] 
        };
        
        await dbContext.Projects.AddAsync(project, ct);

        if (request.MembersIds != null && request.MembersIds.Any()) {
            var membersToAdd = await dbContext.OrganisationMembers
                .Where(m => request.MembersIds.Contains(m.Id))
                .Where(m => m.Id != creatorMember.Id) 
                .ToListAsync(ct);

            foreach (var member in membersToAdd) {
                project.Members.Add(member);
            }
        }
        
        await dbContext.SaveChangesAsync(ct);
        
        var response = new CreateProjectResponse(project.Id, project.Name, project.Description ?? string.Empty);
        return Results.Created($"/api/organisations/{organisationId}/projects/{project.Id}", response);
    }
}