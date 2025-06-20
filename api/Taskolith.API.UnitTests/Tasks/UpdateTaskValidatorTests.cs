using Taskolith.API.Tasks.UpdateTask;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Tasks;

public class UpdateTaskValidatorTests
{
    private readonly UpdateTaskValidator _validator = new ();

    public static IEnumerable<object[]> TaskValidationCases => new List<object[]>
    {
        new object[] { Guid.NewGuid(), "Title", "Description", DateTime.UtcNow.AddHours(1), false, true },
        new object[] { Guid.NewGuid(), null, null, null, null, true },
        new object[] { Guid.NewGuid(), new string('T', 300), "Description", DateTime.UtcNow.AddHours(1), false, false },
        new object[] { Guid.NewGuid(), "Title", new string('D', 1100), DateTime.UtcNow.AddHours(1), false, false },
        new object[] { Guid.NewGuid(), "Title", "Description", DateTime.UtcNow.AddHours(-2), false, false },
        new object[] { Guid.NewGuid(), "Valid", "Valid description", null, true, true },
        new object[] { Guid.NewGuid(), "", "Valid description", DateTime.UtcNow.AddHours(1), false, true },
        new object[] { Guid.NewGuid(), "Complete Task", "Done already", DateTime.UtcNow.AddDays(1), true, true },
        new object[] { Guid.NewGuid(), "A", "Desc", DateTime.UtcNow.AddHours(1), false, true }, // assuming 1-char is valid
        new object[] { Guid.Empty, "Title", "Description", DateTime.UtcNow.AddHours(1), false, false },
    };

    [Theory, MemberData(nameof(TaskValidationCases))]
    public void TaskUpdateValidation_Should_Return_Valid_Results(Guid id, string title, string description, DateTime? dueDate ,bool? completed, bool result)
    {
        var taskUpdate = new UpdateTaskRequest(id, title, description, dueDate, completed);
        var validate = _validator.Validate(taskUpdate);
        Assert.Equal(result, validate.IsValid); 
    }
}