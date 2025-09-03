using FluentValidation;
using Taskolith.API.UserInfo.Requests;

namespace Taskolith.API.Validators;

public class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserValidator()
    {
        RuleFor(request => request)
            .Must(request => !string.IsNullOrWhiteSpace(request.Email) || 
                             !string.IsNullOrWhiteSpace(request.Password) || 
                             !string.IsNullOrWhiteSpace(request.Username))
            .WithMessage("At least one field (Email, Username, or Password) must be provided for an update.");
    
        When(request => !string.IsNullOrEmpty(request.Email), () =>
        {
            RuleFor(request => request.Email)
                .MaximumLength(256)
                .Matches(@"^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$")
                .WithMessage("Email must be in a valid format.");
        });

        When(request => !string.IsNullOrEmpty(request.Password), () =>
        {
            RuleFor(request => request.Password)
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters long.")
                .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
                .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
                .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number.")
                .Matches(@"[\!\?\*\.\@]+").WithMessage("Your password must contain at least one of these special characters: !?*.@");
        });

        When(request => !string.IsNullOrEmpty(request.Username), () =>
        {
            RuleFor(request => request.Username)
                .MaximumLength(20).WithMessage("Username must not exceed 20 characters long.");
        });
    }
}
