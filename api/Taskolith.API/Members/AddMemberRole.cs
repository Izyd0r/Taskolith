using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Members.Requests;

namespace Taskolith.API.Members;

public class AddMemberRole : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{organisationId:guid}/members/{memberId:guid}/roles", Handle)
        .WithRequestValidation<AddMemberRoleRequest>()
        .RequireAuthorization("AddRole")
        .WithSummary("Add role to a member");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid memberId,
        AddMemberRoleRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        var userId = claims.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var member = dbContext.OrganisationMembers
            .Include(membership => membership.Roles).FirstOrDefault(m => m.Id == memberId);
        if (member is null) return Results.NotFound();
        
        var role = dbContext.Roles.FirstOrDefault(r => r.Id == request.RoleId); 
        if (role is null) return Results.NotFound();
        
        dbContext.Entry(member).State = EntityState.Modified;
        if(member.Roles.Any(r=> r.Id == request.RoleId)) 
            return Results.Conflict("Member already have this role");
        member.Roles.Add(role);
        await dbContext.SaveChangesAsync(ct);
        
        return Results.Ok("Role added successfully");
    }
}