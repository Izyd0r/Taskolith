using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.Organisations;

public class UpdateOrganisation : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithRequestValidation<UpdateOrganisationRequest>()
        .RequireAuthorization("UpdateOrganisation")
        .WithSummary("Updates organisation name");

    private static async Task<IResult> Handle(
        UpdateOrganisationRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken token,
        PermissionService permissionService) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
       
        var result = await dbContext.Organisations.SingleOrDefaultAsync(o => o.Id == request.OrganisationId, token);
        if (result == null) return Results.NotFound();
        
        var hasPermission = await permissionService.HasPermission(Guid.Parse(userId), request.OrganisationId, Permission.UpdateOrganisation);
        if(!hasPermission) return Results.Forbid();
        
        result.Name = request.OrganisationName;
        await dbContext.SaveChangesAsync(token);
        
        var response = new UpdateOrganisationResponse(result.Id, result.Name);
        
        return Results.Ok(response);
    }
}