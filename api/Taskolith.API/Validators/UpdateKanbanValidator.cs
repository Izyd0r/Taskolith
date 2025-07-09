using FluentValidation;
using Taskolith.API.Kanban.Requests;

namespace Taskolith.API.Validators;

public class UpdateKanbanValidator : AbstractValidator<UpdateKanbanColumnRequest> {
    public UpdateKanbanValidator() {
        
    }
}