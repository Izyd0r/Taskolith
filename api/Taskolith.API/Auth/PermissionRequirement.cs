using Microsoft.AspNetCore.Authorization;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth;

public class PermissionRequirement(Permission permission) : IAuthorizationRequirement {
    public Permission Permission { get; } = permission;
}