using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Kanban;

public class DeleteKanbanColumn : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{kanbanColumnId:guid}", Handle)
        .RequireAuthorization("DeleteKanbanColumn")
        .WithSummary("Delete a Kanban column");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid kanbanColumnId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var column = await dbContext.KanbanColumns.FindAsync([kanbanColumnId], ct);
        if (column is null) return Results.NotFound();

        dbContext.Entry(column).State = EntityState.Deleted;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}