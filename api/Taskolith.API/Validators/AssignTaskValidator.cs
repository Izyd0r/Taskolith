using FluentValidation;
using Taskolith.API.Tasks.Requests;

namespace Taskolith.API.Validators;

public class AssignTaskValidator : AbstractValidator<AssignTaskRequest> {
    public AssignTaskValidator() {
        RuleFor(request => request.MemberIds)
            .NotNull().WithMessage("At least one member ID must be provided.")
            .NotEmpty().WithMessage("At least one member ID must be provided.")
            .Must(ids => ids.All(id => id != Guid.Empty))
            .WithMessage("All member IDs must be valid (non-empty) GUIDs.");
    }
}