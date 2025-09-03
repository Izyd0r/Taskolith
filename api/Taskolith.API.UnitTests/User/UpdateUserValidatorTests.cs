using Taskolith.API.UserInfo.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.User;

using FluentValidation.TestHelper;

public class UpdateUserValidatorTests
{
    private readonly UpdateUserValidator _validator = new();

    [Theory]
    [InlineData("plainaddress")]
    [InlineData("user@.com")]
    [InlineData("user..name@domain.com")]
    [InlineData("user@domain")]
    [InlineData(".user@domain.com")]
    public void Should_Have_Error_When_Email_Is_Invalid(string invalidEmail)
    {
        // Arrange
        var model = new UpdateUserRequest(null, invalidEmail, null);
        
        // Act
        var result = _validator.TestValidate(model);
        
        // Assert
        result.ShouldHaveValidationErrorFor(r => r.Email).Only();
    }
    
    [Fact]
    public void Should_Have_Error_When_Username_Is_Too_Long()
    {
        var model = new UpdateUserRequest(new string('a', 21), null, null);
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.Username).Only();
    }

    [Theory]
    [InlineData("short")]
    [InlineData("nouppercase1!")]
    [InlineData("NoSpecial1")]
    public void Should_Have_Error_When_Password_Is_Invalid(string invalidPassword)
    {
        var model = new UpdateUserRequest(null, null, invalidPassword);
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(r => r.Password).Only();
    }
    
    [Fact]
    public void Should_Have_Error_When_All_Fields_Are_Null()
    {
        var model = new UpdateUserRequest(null, null, null);
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(request => request);
    }
    
    [Fact]
    public void Should_Not_Have_Any_Errors_When_Only_A_Valid_Email_Is_Provided()
    {
        var model = new UpdateUserRequest(null, "test@example.com", null);
        var result = _validator.TestValidate(model);
        result.ShouldNotHaveAnyValidationErrors();
    }
}