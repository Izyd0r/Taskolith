using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.OrganizationManagement.Roles.Requests;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.OrganizationManagement.Roles;

public class CreateRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{organisationId:guid}/roles", Handle)
        .RequireAuthorization("CreateRole")
        .WithRequestValidation<CreateRoleRequest>()
        .WithSummary("Creates a role");

    private static async Task<IResult> Handle(Guid organisationId, CreateRoleRequest request , AppDbContext dbContext, ClaimsPrincipal claims, CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if(userId == null) return Results.BadRequest();

        var role = new Role {
            Id = Guid.NewGuid(),
            OrganisationId = organisationId,
            Name = request.Name,
            Permissions = request.Permissions
        };
        await dbContext.Roles.AddAsync(role, cancellationToken: ct);
        await dbContext.SaveChangesAsync(ct);
       
        var response = new CreateRoleResponse(role.Id);
        
        return Results.Created($"/api/organisations/{organisationId}/roles/{role.Id}", response);
    }
}