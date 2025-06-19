using FluentValidation;
using Taskolith.API.Tasks.CreateTask;

namespace Taskolith.API.Validators;

public class CreateTaskValidator : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskValidator()
    {
        RuleFor(request => request.Title).NotEmpty().WithMessage("Title is required").MaximumLength(256);
        RuleFor(request => request.Description).MaximumLength(1024);
        RuleFor(request => request.DueDate).NotEmpty().WithMessage("DueDate is required").Must(BeInFuture);
    }

    private bool BeInFuture(DateTime date)
    {
        return date > DateTime.UtcNow;
    }
}