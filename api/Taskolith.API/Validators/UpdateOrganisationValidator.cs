using FluentValidation;
using Taskolith.API.OrganizationManagement.Organisations.Requests;

namespace Taskolith.API.Validators;

public class UpdateOrganisationValidator : AbstractValidator<UpdateOrganisationRequest> {
    public UpdateOrganisationValidator() {
        RuleFor(request => request.OrganisationId).NotEmpty().NotNull();
        RuleFor(request => request.OrganisationName).NotEmpty().NotNull().MaximumLength(100);
    }
}