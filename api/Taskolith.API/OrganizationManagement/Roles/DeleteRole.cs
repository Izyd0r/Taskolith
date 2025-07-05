using Taskolith.API.Common;

namespace Taskolith.API.OrganizationManagement.Roles;

public class DeleteRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{organisationId:guid}/roles/{roleId:guid}", Handle)
        .RequireAuthorization("DeleteRole")
        .WithSummary("Delete role");

    private static async Task<IResult> Handle(Guid organisationId, Guid roleId) {
        return Results.NoContent();
    }
}