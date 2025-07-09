using Taskolith.API.Common;

namespace Taskolith.API.Kanban;

public class DeleteKanbanColumn : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{kanbanColumnId:guid}", Handle)
        .RequireAuthorization("DeleteKanbanColumn")
        .WithSummary("Deletes a Kanban Column");

    private static async Task<IResult> Handle() {
        return Results.NoContent();
    }
}