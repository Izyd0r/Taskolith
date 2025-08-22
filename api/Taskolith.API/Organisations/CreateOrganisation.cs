using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.Organisations;

public class CreateOrganisation : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("", Handle)
        .WithRequestValidation<CreateOrganisationRequest>()
        .WithSummary("Create a new organisation");

    static async Task<IResult> Handle(CreateOrganisationRequest request, AppDbContext db, ClaimsPrincipal user,
        CancellationToken cancellationToken) {
        var userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        var userInDb = await db.Users.FindAsync([Guid.Parse(userId)], cancellationToken: cancellationToken);
        if (userInDb == null) return Results.BadRequest();
        
        var organisation = new Organisation {
            Id = Guid.NewGuid(),
            Name = request.Name
        };

        var allPermissions = Enum.GetValues(typeof(Permission))
            .Cast<Permission>()
            .Aggregate((current, next) => current | next);

        var adminRole = new Role {
            Id = Guid.NewGuid(),
            Name = DefaultRoles.Admin,
            OrganisationId = organisation.Id,
            Permissions = allPermissions
        };

        var memberRole = new Role {
            Id = Guid.NewGuid(),
            Name = DefaultRoles.Member,
            OrganisationId = organisation.Id,
            Permissions = Permission.Public
        };
        
        var membership = new Membership {
            Id = Guid.NewGuid(),
            UserId = Guid.Parse(userId),
            OrganisationId = organisation.Id,
            User = userInDb,
            Organisation = organisation,
            Roles = [adminRole]
        };
 
        organisation.Members.Add(membership);
        db.Organisations.Add(organisation);
        db.OrganisationMembers.Add(membership);
        db.Roles.AddRange(adminRole, memberRole);
        await db.SaveChangesAsync(cancellationToken);

        var response = new CreateOrganisationResponse(organisation.Id, organisation.Name);
        
        return Results.Created($"/api/organisations/{organisation.Id}", response);
    }
}