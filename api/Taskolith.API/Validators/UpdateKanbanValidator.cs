using FluentValidation;
using Taskolith.API.Kanban.Requests;

namespace Taskolith.API.Validators;

public class UpdateKanbanValidator : AbstractValidator<UpdateKanbanColumnRequest> {
    public UpdateKanbanValidator() {
       RuleFor(x => x.Name)
           .NotNull().NotEmpty().WithMessage("Name is required")
           .MinimumLength(3).WithMessage("Name must be at least 3 characters long")
           .MaximumLength(100).WithMessage("Name cannot exceed 100 characters"); 
    }
}