using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Kanban.Requests;

namespace Taskolith.API.Kanban;

public class UpdateKanbanColumn : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{kanbanColumnId:guid}", Handle)
        .WithRequestValidation<UpdateKanbanColumnRequest>()
        .RequireAuthorization("UpdateKanbanColumn")
        .WithSummary("Update a Kanban column");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid kanbanColumnId,
        UpdateKanbanColumnRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var kanbanColumn = await dbContext.KanbanColumns.FindAsync([kanbanColumnId], ct);
        if (kanbanColumn is null) return Results.NotFound();

        dbContext.Entry(kanbanColumn).State = EntityState.Modified;
        kanbanColumn.Name = request.Name;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}