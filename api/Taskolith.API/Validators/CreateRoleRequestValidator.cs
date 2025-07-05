using FluentValidation;
using Taskolith.API.OrganizationManagement.Roles;
using Taskolith.API.OrganizationManagement.Roles.Requests;

namespace Taskolith.API.Validators;

public class CreateRoleRequestValidator : AbstractValidator<CreateRoleRequest> {
    public CreateRoleRequestValidator() {
        RuleFor(x => x.Name)
            .NotNull().WithMessage("Name is required")
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");
    }
}