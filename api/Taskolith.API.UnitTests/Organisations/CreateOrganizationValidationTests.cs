using Taskolith.API.Organisations.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Organisations;

public class CreateOrganizationValidationTests
{
    [Fact]
    public void Validator_For_OrganizationName_Should_Not_Be_Empty() {
        var validator = new CreateOrganisationValidator();
        var request = new CreateOrganisationRequest("");
        var result = validator.Validate(request);
        Assert.False(result.IsValid);
    }
    
    [Fact]
    public void Validator_For_OrganizationName_Should_Not_Be_TooLong() {
        var validator = new CreateOrganisationValidator();
        var request = new CreateOrganisationRequest(new string('a', 101));
        var result = validator.Validate(request);
        Assert.False(result.IsValid); 
    }
 
    [Fact]
    public void Validator_For_OrganizationName_Should_Be_Valid() {
        var validator = new CreateOrganisationValidator();
        var request = new CreateOrganisationRequest("Organization Name");
        var result = validator.Validate(request);
        Assert.True(result.IsValid);  
    }
}