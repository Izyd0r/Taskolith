using FluentValidation;
using Taskolith.API.OrganizationManagement.Organisations.CreateOrganisation;

namespace Taskolith.API.Validators;

public class CreateOrganisationValidator : AbstractValidator<CreateOrganisationRequest> {
    public CreateOrganisationValidator() {
        RuleFor(x => x.Name).NotNull().NotEmpty().MaximumLength(100);
    }
}