using FluentValidation.TestHelper;
using Taskolith.API.Data.Types;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Validators;

namespace Taskolith.API.UnitTests.Tasks;

public class CreateTaskValidatorTests {
   private readonly CreateTaskValidator validator = new();

   public static IEnumerable<object[]> TaskValidationCases =>
      new List<object[]> {
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
   public void Should_Validate_Title_Description_And_DueDate(string title, string description, DateTime dueDate,
      bool expected) {
      var assignedMembers = new List<Guid> { Guid.NewGuid() };
      int order = 1;
      Priority priority = Priority.Medium;
      var request = new CreateTaskRequest(title, description, dueDate, assignedMembers, order, priority);
      var result = validator.TestValidate(request);
      Assert.Equal(expected, result.IsValid);
   }
}