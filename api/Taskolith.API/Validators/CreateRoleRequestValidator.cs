using FluentValidation;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Roles;
using Taskolith.API.Roles.Requests;

namespace Taskolith.API.Validators;

public class CreateRoleRequestValidator : AbstractValidator<CreateRoleRequest> {
    public CreateRoleRequestValidator() {
        RuleFor(x => x.Name)
            .NotNull().WithMessage("Name is required")
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");
        RuleFor(x => x.Permissions)
            .Must(BeAValidPermission).WithMessage("Invalid permission flags"); 
    }
    
    private bool BeAValidPermission(Permission permission) {
        var allDefined = Enum.IsDefined(typeof(Permission), permission);
        if (allDefined) return true;

        var allValidFlags = Enum.GetValues<Permission>()
            .Aggregate(Permission.Public, (current, next) => current | next);

        return (permission & ~allValidFlags) == 0;
    }
}