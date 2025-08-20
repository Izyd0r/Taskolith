using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Taskolith.API.Auth;

public class PermissionHandler(PermissionService permissionService, IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<PermissionRequirement> {
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement) {
        var userIdString = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var organisationId = ExtractOrganisationIdFromRoute();
        var projectId = ExtractProjectIdFromRoute();

        if (!Guid.TryParse(userIdString, out var userId) || organisationId == Guid.Empty) {
            return;
        }

        if (projectId == Guid.Empty) {
            if (await permissionService.HasPermission(userId, organisationId, requirement.Permission)) {
                context.Succeed(requirement);
            }
        }
        else {
            if (await permissionService.HasProjectAccessAsync(userId, organisationId, projectId, requirement.Permission)) {
                context.Succeed(requirement);
            }
        }
    }

    private Guid ExtractOrganisationIdFromRoute() {
        var organisationId = httpContextAccessor.HttpContext?.Request.RouteValues["organisationId"]?.ToString();
        return Guid.TryParse(organisationId, out var id) ? id : Guid.Empty;
    }

    private Guid ExtractProjectIdFromRoute() {
        var projectId = httpContextAccessor.HttpContext?.Request.RouteValues["projectId"]?.ToString();
        return Guid.TryParse(projectId, out var id) ? id : Guid.Empty;
    }
}