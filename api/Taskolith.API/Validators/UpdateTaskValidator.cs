using FluentValidation;
using Taskolith.API.Tasks.Requests;

namespace Taskolith.API.Validators;

public class UpdateTaskValidator : AbstractValidator<UpdateTaskRequest> {
    public UpdateTaskValidator() {
        RuleFor(x => x.Title)
            .MaximumLength(256)
            .WithMessage("Title must be at most 256 characters.")
            .When(x => x.Title is not null);

        RuleFor(x => x.Description)
            .MaximumLength(1024)
            .WithMessage("Description must be at most 1024 characters.")
            .When(x => x.Description is not null);

        RuleFor(x => x.DueDate)
            .Must(BeInFuture)
            .WithMessage("Due date must be in the future.")
            .When(x => x.DueDate is not null);

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Order must be at least 1.")
            .When(x => x.Order is not null);

        RuleFor(x => x.Priority)
            .IsInEnum()
            .WithMessage("Priority value is invalid.")
            .When(x => x.Priority is not null);

        RuleFor(x => x.KanbanColumnId)
            .NotEqual(Guid.Empty)
            .WithMessage("Kanban column ID must be a valid GUID.")
            .When(x => x.KanbanColumnId is not null);
    }

    private bool BeInFuture(DateTime? date) {
        return date == null || date > DateTime.UtcNow;
    }
}