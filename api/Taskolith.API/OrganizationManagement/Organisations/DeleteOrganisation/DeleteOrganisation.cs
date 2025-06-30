using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.Organisations.DeleteOrganisation;

public class DeleteOrganisation : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{organisationId:guid}", Handle)
        .WithSummary("Deletes organisation");

    static async Task<IResult> Handle(Guid organisationId, AppDbContext db, ClaimsPrincipal user ,CancellationToken token) {
        var userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        
        var isUserAdmin = await db.OrganisationMembers
            .Where(x => x.UserId == Guid.Parse(userId) && x.OrganisationId == organisationId)
            .SelectMany(x => x.Roles)
            .FirstOrDefaultAsync(r => r.Name == "Admin", cancellationToken: token);
        if (isUserAdmin == null) return Results.BadRequest();
            
        var deletedRows = await db.Organisations.Where(o => o.Id == organisationId).ExecuteDeleteAsync(cancellationToken: token);
        return deletedRows == 1 ? Results.NoContent() : Results.NotFound();
    }
}