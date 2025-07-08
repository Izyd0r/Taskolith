using FluentValidation;
using Taskolith.API.Projects.Requests;

namespace Taskolith.API.Validators;

public class CreateProjectValidator : AbstractValidator<CreateProjectRequest> {
    public CreateProjectValidator() {
        RuleFor(x => x.Name)
            .NotNull().NotEmpty().WithMessage("Name is required.")
            .MinimumLength(3).WithMessage("Name must be at least 3 characters long.")
            .MaximumLength(50).WithMessage("Name cannot exceed 50 characters.");
        RuleFor(x => x.Description)
            .NotNull().NotEmpty().WithMessage("Description is required.")
            .MinimumLength(3).WithMessage("Description must be at least 3 characters long.")
            .MaximumLength(100).WithMessage("Description cannot exceed 100 characters.");
        RuleForEach(x => x.Members)
            .SetValidator(new MembershipValidator())
            .When(x => x.Members is not null);
    }
}