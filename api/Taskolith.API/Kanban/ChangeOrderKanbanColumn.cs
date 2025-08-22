using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Kanban.Requests;

namespace Taskolith.API.Kanban;

public class ChangeOrderKanbanColumn : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/reorder", Handle)
        .WithRequestValidation<ChangeOrderKanbanColumnRequest>()
        .RequireAuthorization("UpdateKanbanColumn")
        .WithSummary("Reorder Kanban columns");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        ChangeOrderKanbanColumnRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var kanbanColumn = await dbContext.KanbanColumns.FindAsync([request.ColumnId], ct);
        if (kanbanColumn is null) return Results.NotFound();

        dbContext.Entry(kanbanColumn).State = EntityState.Modified;
        kanbanColumn.Order = request.Order;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}