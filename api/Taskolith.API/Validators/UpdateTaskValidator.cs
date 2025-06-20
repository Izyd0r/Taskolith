using FluentValidation;
using Taskolith.API.Tasks.UpdateTask;

namespace Taskolith.API.Validators;

public class UpdateTaskValidator : AbstractValidator<UpdateTaskRequest>
{
    public UpdateTaskValidator()
    { 
       RuleFor(task => task.Title).MaximumLength(256);
       RuleFor(task => task.Description).MaximumLength(1024);
       RuleFor(task => task.DueDate).Must(BeInFuture).When(x => x.DueDate.HasValue).WithMessage("Due date must be in the future.");
       RuleFor(task => task.TaskId).NotEqual(Guid.Empty).WithMessage("Invalid TaskId.");
    }

    private bool BeInFuture(DateTime? dueDate)
    {
        return dueDate.HasValue && dueDate.Value > DateTime.UtcNow;
    }
}