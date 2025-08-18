using FluentValidation.TestHelper;
using Taskolith.API.Data.Types;
using Taskolith.API.Roles.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Roles;

public class UpdateRoleValidatorTests {
    private readonly UpdateRoleValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_Name_Is_Empty() {
        var model = new UpdateRoleRequest("", Permission.CreateRole);
        var result = _validator.TestValidate(model);

        result.ShouldHaveValidationErrorFor(x => x.Name)
              .WithErrorMessage("Name is required");
    }

    [Fact]
    public void Should_Have_Error_When_Name_Exceeds_Max_Length() {
        var model = new UpdateRoleRequest(new string('a', 101), Permission.CreateRole);
        var result = _validator.TestValidate(model);

        result.ShouldHaveValidationErrorFor(x => x.Name)
              .WithErrorMessage("Name cannot exceed 100 characters");
    }

    [Fact]
    public void Should_Not_Have_Error_When_Name_Is_Valid() {
        var model = new UpdateRoleRequest("Admin", Permission.CreateRole);
        var result = _validator.TestValidate(model);

        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Permissions_Are_Valid() {
        var validPermissions = Permission.CreateRole | Permission.DeleteRole;
        var model = new UpdateRoleRequest("Valid", validPermissions);
        var result = _validator.TestValidate(model);

        result.ShouldNotHaveValidationErrorFor(x => x.Permissions);
    }

    [Fact]
    public void Should_Have_Error_When_Permissions_Are_Invalid() {
        var invalidPermission = (Permission)(1 << 30);
        var model = new UpdateRoleRequest("Invalid", invalidPermission);
        var result = _validator.TestValidate(model);

        result.ShouldHaveValidationErrorFor(x => x.Permissions)
              .WithErrorMessage("Invalid permission flags");
    }

    [Fact]
    public void Should_Allow_Public_Permission() {
        var model = new UpdateRoleRequest("Public", Permission.Public);
        var result = _validator.TestValidate(model);

        result.ShouldNotHaveValidationErrorFor(x => x.Permissions);
    }
}