using FluentValidation.TestHelper;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Projects;

public class UpdateProjectValidatorTests {
    private readonly UpdateProjectValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_Name_Is_Null() {
        var request = new UpdateProjectRequest(null!, "Valid description");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Have_Error_When_Name_Is_Empty() {
        var request = new UpdateProjectRequest("", "Valid description");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Have_Error_When_Name_Is_Too_Short() {
        var request = new UpdateProjectRequest("AB", "Valid description");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Have_Error_When_Name_Is_Too_Long() {
        var longName = new string('A', 51);
        var request = new UpdateProjectRequest(longName, "Valid description");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Have_Error_When_Description_Is_Null() {
        var request = new UpdateProjectRequest("Valid Name", null!);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Should_Have_Error_When_Description_Is_Empty() {
        var request = new UpdateProjectRequest("Valid Name", "");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Should_Have_Error_When_Description_Is_Too_Short() {
        var request = new UpdateProjectRequest("Valid Name", "AB");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Should_Have_Error_When_Description_Is_Too_Long() {
        var longDescription = new string('D', 101);
        var request = new UpdateProjectRequest("Valid Name", longDescription);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Should_Not_Have_Errors_When_Request_Is_Valid() {
        var request = new UpdateProjectRequest("Valid Name", "Valid description");
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveAnyValidationErrors();
    }
}