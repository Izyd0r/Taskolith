using FluentValidation;
using Taskolith.API.Data.Types;
using Taskolith.API.Roles.Requests;

namespace Taskolith.API.Validators;

public class UpdateRoleValidator : AbstractValidator<UpdateRoleRequest> {
    public UpdateRoleValidator() {
       RuleFor(request => request.Name)
           .NotEmpty().WithMessage("Name is required")
           .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");
       RuleFor(request => request.Permissions)
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