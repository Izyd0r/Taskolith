using Taskolith.API.Common;

namespace Taskolith.API.OrganizationManagement.Roles;

public class UpdateRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{organisationId:guid}/roles/{roleId:guid}", Handle)
        .RequireAuthorization("UpdateRole")
        .WithSummary("Updates a role");

    private static async Task<IResult> Handle(Guid organisationId, Guid roleId) {
        return Results.Ok();
    }
}