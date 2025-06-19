using FluentValidation.TestHelper;
using Taskolith.API.Tasks.CreateTask;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Tasks;

public class CreateTaskValidatorTests
{
   private readonly CreateTaskValidator validator = new();

   public static IEnumerable<object[]> TaskValidationCases =>
      new List<object[]>
      {
         new object[] { null, "Description", DateTime.UtcNow.AddHours(1), false },
         new object[] { "", "Description", DateTime.UtcNow.AddHours(1), false },
         new object[] { "Ok", "Description", DateTime.UtcNow.AddHours(1), true },
         new object[] { "Sh", "Description", DateTime.UtcNow.AddHours(1), true },
         new object[] { "Valid", new string('a', 1025), DateTime.UtcNow.AddHours(1), false },
         new object[] { "Valid", new string('a', 1024), DateTime.UtcNow.AddHours(1), true },
         new object[] { "Valid", "", DateTime.UtcNow.AddHours(1), true },

         new object[] { "Valid", "Description", DateTime.UtcNow.AddHours(-1), false },
         new object[] { "Valid", "Description", DateTime.UtcNow, false },
         new object[] { "Valid", "Description", DateTime.UtcNow.AddSeconds(1), true },
         new object[] { "Valid", "Description", DateTime.UtcNow.AddDays(1), true },
      };

   
   [Theory]
   [MemberData(nameof(TaskValidationCases))]
   public void Should_Validate_Title_Description_And_DueTime(string title, string description, DateTime dueTime, bool expected)
   {
      var task = new CreateTaskRequest(title, description, dueTime);
      var result = validator.TestValidate(task);
      Assert.Equal(expected, result.IsValid);
   }
}