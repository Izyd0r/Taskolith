using FluentValidation;
using Taskolith.API.Data.Types;
using Taskolith.API.Members.Requests;

namespace Taskolith.API.Validators;

public class AddMemberRoleValidator : AbstractValidator<AddMemberRoleRequest> {
    public AddMemberRoleValidator() {
        RuleFor(x => x.RoleId).NotEmpty().WithMessage("RoleId is required");
    }
}