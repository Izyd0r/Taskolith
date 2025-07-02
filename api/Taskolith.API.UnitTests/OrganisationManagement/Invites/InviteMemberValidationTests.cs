using FluentValidation.TestHelper;
using Taskolith.API.OrganizationManagement.InviteSystem;
using Taskolith.API.OrganizationManagement.InviteSystem.InviteMember;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.OrganisationManagement.Invites;

public class InviteMemberValidationTests
{
    private readonly InviteMemberRequestValidator _validator = new();

    [Fact]
    public void Email_Should_Have_Error_When_Empty()
    {
        var model = new InviteMemberRequest("", DateTime.UtcNow.AddDays(1));
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Email)
              .WithErrorMessage("Email is required");
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("test@")]
    [InlineData("test@com")]
    [InlineData("test@.com")]
    public void Email_Should_Have_Error_When_InvalidFormat(string email)
    {
        var model = new InviteMemberRequest(email, DateTime.UtcNow.AddDays(1));
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.Email)
              .WithErrorMessage("Email must be a valid format.");
    }

    [Fact]
    public void Email_Should_Not_Have_Error_When_Valid()
    {
        var model = new InviteMemberRequest("test.email+alias@example.com", DateTime.UtcNow.AddDays(1));
        var result = _validator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void DueDate_Should_Have_Error_When_InPast()
    {
        var model = new InviteMemberRequest("test@example.com", DateTime.UtcNow.AddMinutes(-1));
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.DueDate);
    }

    [Fact]
    public void DueDate_Should_Not_Have_Error_When_InFuture()
    {
        var model = new InviteMemberRequest("test@example.com", DateTime.UtcNow.AddHours(1));
        var result = _validator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.DueDate);
    }
}