using FluentValidation;
using Taskolith.API.OrganizationManagement.Organisations.Requests;

namespace Taskolith.API.Validators;

public class CreateOrganisationValidator : AbstractValidator<CreateOrganisationRequest> {
    public CreateOrganisationValidator() {
        RuleFor(x => x.Name).NotNull().NotEmpty().MaximumLength(100);
    }
}