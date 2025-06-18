using FluentValidation;
using Taskolith.API.Auth.Login;

namespace Taskolith.API.Validators;

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(request => request.Username).NotEmpty().WithMessage("Username is required");
        RuleFor(request => request.Password).NotEmpty().WithMessage("Password is required");
    }
}