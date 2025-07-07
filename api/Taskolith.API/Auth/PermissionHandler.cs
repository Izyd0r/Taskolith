using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth;

public class PermissionHandler(PermissionService permissionService, IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<PermissionRequirement> {
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement) {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var organisationId = ExtractOrganisationIdFromRoute();
        if (userId == null || organisationId == Guid.Empty) return; 
        
        if(await permissionService.HasPermission(Guid.Parse(userId), organisationId, requirement.Permission))
            context.Succeed(requirement);
    }

    private Guid ExtractOrganisationIdFromRoute() {
        var organisationId = httpContextAccessor.HttpContext?.Request.RouteValues["organisationId"]?.ToString();
        return Guid.TryParse(organisationId, out var id) ? id : Guid.Empty;
    }
}