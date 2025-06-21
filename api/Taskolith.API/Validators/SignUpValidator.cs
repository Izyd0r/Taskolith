using FluentValidation;
using Taskolith.API.Auth.SignUp;

namespace Taskolith.API.Validators;

public class SignUpValidator : AbstractValidator<SignUpRequest>
{
    public SignUpValidator()
    {
        RuleFor(request => request.Email)
            .NotEmpty().WithMessage("Email is required")
            .MaximumLength(256)
            .Matches(@"^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$").WithMessage("Email must be a valid format.");
        
        RuleFor(request => request.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .MaximumLength(100).WithMessage("Password must not exceed 100 characters long")
            .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
            .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
            .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number.")
            .Matches(@"[\!\?\*\.\@]+").WithMessage("Your password must contain at least one (!?*.@).");

        RuleFor(request => request.Username)
            .NotEmpty().WithMessage("Username is required")
            .MaximumLength(20).WithMessage("Username must not exceed 20 characters long");
        
        RuleFor(request => request.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(20).WithMessage("First name must not exceed 20 characters long");
        
        RuleFor(request => request.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(20).WithMessage("Last name must not exceed 20 characters long");
    }
}