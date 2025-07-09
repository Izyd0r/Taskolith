using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;

namespace Taskolith.API.Kanban;

public class CreateKanbanColumn : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("", Handle)
        .WithRequestValidation<CreateKanbanColumnRequest>()
        .RequireAuthorization("CreateKanbanColumn")
        .WithSummary("Creates a new Kanban Column");

    private static async Task<IResult> Handle(
        Guid organisationId, 
        Guid projectId, 
        CreateKanbanColumnRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var column = new KanbanColumn() {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Name = request.Name,
            Order = 1, // TODO: make it automatic
            Project = await dbContext.Projects.FindAsync([projectId], ct).ConfigureAwait(false),
        };
       
        await dbContext.KanbanColumns.AddAsync(column, ct);
        await dbContext.SaveChangesAsync(ct);
        
        var response = new CreateKanbanColumnResponse(column.Id);
        
        return Results.Created($"/api/organisations/{organisationId}/projects/{projectId}/columns/{column.Id}",response);
    }
}