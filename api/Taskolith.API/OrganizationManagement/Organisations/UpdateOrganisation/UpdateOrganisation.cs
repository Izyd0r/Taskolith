using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;

namespace Taskolith.API.OrganizationManagement.Organisations.UpdateOrganisation;

public class UpdateOrganisation : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithRequestValidation<UpdateOrganisationRequest>()
        .WithSummary("Updates organisation name");

    private static async Task<IResult> Handle(UpdateOrganisationRequest request, AppDbContext dbContext, ClaimsPrincipal claims ,CancellationToken token) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        
        var isUserAdmin = await dbContext.OrganisationMembers
            .Where(x => x.UserId == Guid.Parse(userId) && x.OrganisationId == request.OrganisationId)
            .SelectMany(x => x.Roles)
            .FirstOrDefaultAsync(r => r.Name == "Admin", cancellationToken: token);
        if (isUserAdmin == null) return Results.BadRequest(); 
        
        var result = await dbContext.Organisations.SingleOrDefaultAsync(o => o.Id == request.OrganisationId, token);
        if (result == null) return Results.BadRequest();
        result.Name = request.OrganisationName;
        await dbContext.SaveChangesAsync(token);
        
        var response = new UpdateOrganisationResponse(result.Id, result.Name);
        
        return Results.Ok(response);
    }
}