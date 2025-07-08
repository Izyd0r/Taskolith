using FluentValidation;
using Taskolith.API.Data.Dtos;

namespace Taskolith.API.Validators;

public class MembershipValidator : AbstractValidator<MembershipDto> {
    public MembershipValidator() {
        RuleFor(x => x.MemberId)
            .NotNull().NotEmpty().WithMessage("MemberId is required.");
        RuleFor(x => x.UserId)
            .NotNull().NotEmpty().WithMessage("UserId is required.");
        RuleFor(x => x.OrganisationId)
            .NotNull().NotEmpty().WithMessage("OrganisationId is required.");
    }
}