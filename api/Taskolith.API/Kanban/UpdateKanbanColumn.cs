using Taskolith.API.Common;
using Taskolith.API.Filters;
using Taskolith.API.Kanban.Requests;

namespace Taskolith.API.Kanban;

public class UpdateKanbanColumn : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{kanbanColumnId:guid}", Handle)
        .WithRequestValidation<UpdateKanbanColumnRequest>()
        .RequireAuthorization("UpdateKanbanColumn")
        .WithSummary("Updates a Kanban Column");

    private static async Task<IResult> Handle() {
        return Results.NoContent();
    }
}