using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.Organisations;

public class GetUserOrganisations : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/user", Handle)
        .WithSummary("Get organisations the user belongs to");

    private static async Task<IResult> Handle(AppDbContext dbContext, ClaimsPrincipal claims, CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();

        var organisations = await dbContext.Organisations
            .Include(o => o.Members)
            .Where(o => o.Members.Any(m => m.UserId == Guid.Parse(userId)))
            .Select(o => new GetUserOrganisationsResponse(o.Id, o.Name))
            .ToListAsync(cancellationToken: ct);
        
        return Results.Ok(organisations);
    }
}