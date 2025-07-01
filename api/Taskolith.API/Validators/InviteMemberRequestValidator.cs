using FluentValidation;
using Taskolith.API.OrganizationManagement.InviteSystem;

namespace Taskolith.API.Validators;

public class InviteMemberRequestValidator : AbstractValidator<InviteMemberRequest> {
    public InviteMemberRequestValidator() {
        RuleFor(request => request.Email)
            .NotEmpty().WithMessage("Email is required")
            .MaximumLength(256)
            .Matches(@"^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Email must be a valid format.");
        RuleFor(request => request.DueDate).NotEmpty().NotNull().WithMessage("DueDate is required").Must(BeInFuture);
    }
    private bool BeInFuture(DateTime date) => date > DateTime.UtcNow;
}