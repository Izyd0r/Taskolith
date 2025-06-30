using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.Filters;

namespace Taskolith.API.OrganizationManagement.Organisations.CreateOrganisation;

public class CreateOrganisation : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("", Handle)
        .WithRequestValidation<CreateOrganisationRequest>()
        .WithSummary("Creates a new organization");

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

        var membership = new Membership {
            Id = Guid.NewGuid(),
            UserId = Guid.Parse(userId),
            OrganisationId = organisation.Id,
            User = userInDb,
            Organisation = organisation,
            Roles = new List<Role>() { new Role {
                    Id = Guid.NewGuid(),
                    Name = "Admin",
                    OrganisationId = organisation.Id
                }
            }
        };
 
        organisation.Members.Add(membership);
        db.Organisations.Add(organisation);
        db.OrganisationMembers.Add(membership);
        await db.SaveChangesAsync(cancellationToken);

        var response = new CreateOrganisationResponse(organisation.Id, organisation.Name);
        
        return Results.Created($"/api/organisations/{organisation.Id}", response);
    }
}