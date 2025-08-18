using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Members;

public class KickMember : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{organisationId:guid}/members/{memberId:guid}", Handle)
        .RequireAuthorization("KickMember")
        .WithSummary("Kicks a member out of organisation");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid memberId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if(userId is null) return Results.BadRequest();
       
        var member = dbContext.OrganisationMembers.Include(membership => membership.Roles).FirstOrDefault(m => m.Id == memberId);
        if(member is null) return Results.NotFound();
        if(member.Roles.Any(r=> r.Name == "Admin")) return Results.BadRequest();
        
        dbContext.Entry(member).State = EntityState.Deleted;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}