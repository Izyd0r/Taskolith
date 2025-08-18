using FluentValidation.TestHelper;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Projects;

public class CreateProjectValidatorTests {
    private readonly CreateProjectValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_Name_Is_Missing()
    {
        var request = new CreateProjectRequest("", "Valid description");
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
    
    [Fact]
    public void Should_Not_Have_Errors_When_Request_Is_Valid()
    {
        var validMember = new MembershipDto(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), "Name", "Email@email.com");
        var request = new CreateProjectRequest("Project X", "Some description", new List<Guid> { validMember.MemberId });

        var result = _validator.TestValidate(request);
        result.ShouldNotHaveAnyValidationErrors();
    }
}