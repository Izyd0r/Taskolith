using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth;

public class PermissionService(AppDbContext dbContext) {
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<bool> HasPermission(Guid userId, Guid organisationId, Permission permission) {
        return await _dbContext.OrganisationMembers
            .Where(m => m.OrganisationId == organisationId && m.UserId == userId)
            .Include(m => m.Roles)
            .AnyAsync(m => m.Roles.Any(r => (r.Permissions & permission) == permission));
    }

    public async Task<bool> HasProjectAccessAsync(Guid userId, Guid organisationId, Guid projectId, Permission permission) {
        return await _dbContext.OrganisationMembers
            .Where(m => m.OrganisationId == organisationId && m.UserId == userId)
            .Where(m => m.Projects.Any(p => p.Id == projectId))
            .AnyAsync(m => m.Roles.Any(r => (r.Permissions & permission) == permission));
    }
}