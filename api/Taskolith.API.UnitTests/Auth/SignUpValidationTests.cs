using FluentValidation.TestHelper;
using Taskolith.API.Auth;
using Taskolith.API.Auth.SignUp;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Auth;

public class SignUpValidationTests 
{
    private readonly SignUpValidator _validator = new();

    [Fact]
    public void Should_Not_Have_Errors_When_Model_Is_Valid()
    {
        // Arrange
        var model = new SignUpRequest
        (
            "exampleusername",
            "Password!123",
            "example@email.com",
            "John",
            "Doe"
        );
        // Act
        var result = _validator.TestValidate(model);
        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void Should_Have_Error_When_Password_Is_Missing(string? password)
    {
        // Arrange
        var model = new SignUpRequest
        (
            "exampleusername",
            password,
            "example@email.com",
            "John",
            "Doe"
        );
        // Act
        var result = _validator.TestValidate(model);
        // Assert
        result.ShouldHaveValidationErrorFor(r => r.Password).Only();
    }

    [Theory]
    [InlineData("@domain.com")]
    [InlineData("plainaddress")]
    [InlineData("email.domain.com")]
    [InlineData("user@")]
    [InlineData("user@.com")]
    [InlineData("user@@domain.com")]
    [InlineData("user@domain@domain.com")]
    [InlineData("user^name@domain.com")]
    [InlineData("user!@domain.com")]
    [InlineData("user#domain.com")]
    [InlineData(".user@domain.com")]
    [InlineData("user.@domain.com")]
    [InlineData("user..name@domain.com")]
    [InlineData("user@domain..com")]
    [InlineData("user@domain")]
    [InlineData("user@domain.")]
    [InlineData("user@domain.c")]
    [InlineData("user name@domain.com")]
    [InlineData("user@ domain.com")]
    [InlineData("user@domain. com")]
    [InlineData("usér@domain.com")]
    [InlineData("用户@例子.公司")]
    public void Should_Have_Error_When_Email_Is_Invalid(string email)
    {
        // Arrange
        var model = new SignUpRequest
        (
            "exampleusername",
            "Passwor123@", 
            email,
            "John",
            "Doe"
        );
        // Act
        var result = _validator.TestValidate(model);
        // Assert
        result.ShouldHaveValidationErrorFor(r => r.Email).Only();
    }
    
    [Fact]
    public void Should_Have_Error_When_Email_Too_Long()
    {
        // Arrange
        var longEmail = new string('a', 300) + "@example.com";
        var model = new SignUpRequest( "usernameexample" , "validPass123@", longEmail, "John", "Doe" );
        // Act
        var result = _validator.TestValidate(model);
        // Assert
        result.ShouldHaveValidationErrorFor(r => r.Email).Only();
    }

    [Theory]
    [InlineData("")]
    [InlineData("       ")]
    [InlineData("Ab1!")]
    [InlineData("abcdefgh")]
    [InlineData("ABCDEFGH")]
    [InlineData("Abcdefgh")]
    [InlineData("Abcdefg1")]
    [InlineData("Abc!@#$%")]
    [InlineData("12345678")]
    [InlineData("abc12345")]
    [InlineData("ABC12345")]
    [InlineData("Ab1")]
    [InlineData("Goodpass1")]
    [InlineData("GOODPASS1!")]
    [InlineData("goodpass1!")]
    [InlineData("Abcdefg!")]
    public void Should_Have_Error_When_Password_Is_Invalid(string? password)
    {
        // Arrange
        var model = new SignUpRequest
        (
            "exampleusername",
            password, 
            "example@email.com",
            "John",
            "Doe"
        );
        // Act
        var result = _validator.TestValidate(model);
        // Assert
        result.ShouldHaveValidationErrorFor(r => r.Password).Only();
    }
}