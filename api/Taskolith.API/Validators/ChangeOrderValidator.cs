using FluentValidation;
using Taskolith.API.Kanban.Requests;

namespace Taskolith.API.Validators;

public class ChangeOrderValidator : AbstractValidator<ChangeOrderKanbanColumnRequest> {
    public ChangeOrderValidator() {
        RuleFor(request => request.ColumnId)
            .NotNull().NotEmpty().WithMessage("ColumnId is required.");
        RuleFor(request => request.Order)
            .NotNull().NotEmpty().WithMessage("Order cannot be empty")
            .GreaterThan(0).WithMessage("Order must be greater than 0")
            .LessThan(100).WithMessage("Order must be less than 100");
    }
}