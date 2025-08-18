using FluentValidation.TestHelper;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Organisations;

public class UpdateOrganisationValidationTests
{
    private readonly UpdateOrganisationValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_OrganisationId_Is_Empty()
    {
        var request = new UpdateOrganisationRequest(Guid.Empty, "Valid Name");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(r => r.OrganisationId);
    }

    [Fact]
    public void Should_Have_Error_When_OrganisationName_Is_Null()
    {
        var request = new UpdateOrganisationRequest(Guid.NewGuid(), null);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(r => r.OrganisationName);
    }

    [Fact]
    public void Should_Have_Error_When_OrganisationName_Is_Empty()
    {
        var request = new UpdateOrganisationRequest(Guid.NewGuid(), "");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(r => r.OrganisationName);
    }

    [Fact]
    public void Should_Have_Error_When_OrganisationName_Is_Too_Long()
    {
        var request = new UpdateOrganisationRequest(Guid.NewGuid(), new string('a', 101));
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(r => r.OrganisationName);
    }

    [Fact]
    public void Should_Not_Have_Any_Validation_Errors_For_Valid_Input()
    {
        var request = new UpdateOrganisationRequest(Guid.NewGuid(), "Valid Org Name");
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveAnyValidationErrors();
    } 
}