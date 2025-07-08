using FluentValidation;
using Taskolith.API.Projects.Requests;

namespace Taskolith.API.Validators;

public class AssignProjectValidator : AbstractValidator<AssignProjectRequest> {
    public AssignProjectValidator() {
        RuleFor(x => x.MembersId).NotEmpty().WithMessage("Members ID cannot be empty");
    }
}