using FluentValidation;
using Taskolith.API.Tasks.Requests;

namespace Taskolith.API.Validators;

public class CreateTaskValidator : AbstractValidator<CreateTaskRequest> {
    public CreateTaskValidator() {
        RuleFor(request => request.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(256).WithMessage("Title must be at most 256 characters.");

        RuleFor(request => request.Description)
            .MaximumLength(1024).WithMessage("Description must be at most 1024 characters.");

        RuleFor(request => request.DueDate)
            .NotEmpty().WithMessage("Due date is required.")
            .Must(BeInFuture).WithMessage("Due date must be in the future.");

        RuleFor(request => request.AssignedMembers)
            .Must(members => members == null || members.All(g => g != Guid.Empty))
            .WithMessage("Assigned members contain invalid GUID(s).");

        RuleFor(request => request.Order)
            .GreaterThanOrEqualTo(1).WithMessage("Order must be 1 or greater.");

        RuleFor(request => request.Priority)
            .IsInEnum().WithMessage("Priority value is invalid.");    
    }

    private bool BeInFuture(DateTime date) {
        return date > DateTime.UtcNow;
    }
}