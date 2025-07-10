using Taskolith.API.Tasks.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Tasks;

public class UpdateTaskValidatorTests {
    private readonly UpdateTaskValidator _validator = new();

    public static IEnumerable<object[]> TaskValidationCases => new List<object[]> {
        // title, description, dueDate, isCompleted, expectedResult
        new object[] { "Title", "Description", DateTime.UtcNow.AddHours(1), false, true },
        new object[] { null, null, null, null, true }, // all optional, valid
        new object[] { new string('T', 300), "Description", DateTime.UtcNow.AddHours(1), false, false }, // Title too long
        new object[] { "Title", new string('D', 1100), DateTime.UtcNow.AddHours(1), false, false }, // Description too long
        new object[] { "Title", "Description", DateTime.UtcNow.AddHours(-2), false, false }, // DueDate in past
        new object[] { "Valid", "Valid description", null, true, true },
        new object[] { "", "Valid description", DateTime.UtcNow.AddHours(1), false, true }, // empty string is technically valid
        new object[] { "Complete Task", "Done already", DateTime.UtcNow.AddDays(1), true, true },
        new object[] { "A", "Desc", DateTime.UtcNow.AddHours(1), false, true },
    };

    [Theory]
    [MemberData(nameof(TaskValidationCases))]
    public void TaskUpdateValidation_Should_Return_Valid_Results(string? title, string? description, DateTime? dueDate, bool? completed, bool expectedIsValid) {
        var taskUpdate = new UpdateTaskRequest
        {
            Title = title,
            Description = description,
            DueDate = dueDate,
            IsCompleted = completed
        };
        var result = _validator.Validate(taskUpdate);
        Assert.Equal(expectedIsValid, result.IsValid);
    }
}