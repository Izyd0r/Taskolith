using FluentValidation.TestHelper;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Members.Requests;
using Taskolith.API.OrganizationManagement.Roles.Responses;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.OrganisationManagement.Members;

public class AddMemberRoleValidatorTests {
    private readonly AddMemberRoleValidator _validator = new();

    [Fact]
    public void Should_Have_Validation_Error_When_RoleId_Is_Empty() {
        var request = new AddMemberRoleRequest(Guid.Empty);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(r => r.RoleId)
            .WithErrorMessage("RoleId is required");
    }

    [Fact]
    public void Should_Not_Have_Validation_Error_When_RoleId_Is_Provided() {
        var request = new AddMemberRoleRequest(Guid.NewGuid());
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(r => r.RoleId);
    }
}