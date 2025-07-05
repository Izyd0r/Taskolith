using FluentValidation.TestHelper;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Roles;
using Taskolith.API.OrganizationManagement.Roles.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.OrganisationManagement.Roles;

public class CreateRoleRequestValidatorTests
{
    private readonly CreateRoleRequestValidator _validator = new();
    
    [Fact]
    public void Should_Have_Error_When_Name_Is_Empty()
    {
        var model = new CreateRoleRequest("",Permission.Public,new List<Guid>());
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Name)
            .WithErrorMessage("Name is required");
    }

    [Fact]
    public void Should_Have_Error_When_Name_Exceeds_Max_Length()
    {
        var model = new CreateRoleRequest (new string('a', 101), Permission.Public,new List<Guid>() );
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Name)
            .WithErrorMessage("Name must not exceed 100 characters");
    }

    [Fact]
    public void Should_Not_Have_Error_When_Name_Is_Valid()
    {
        var model = new CreateRoleRequest ("Valid name for the role", Permission.Public,new List<Guid>() );
        var result = _validator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }
}