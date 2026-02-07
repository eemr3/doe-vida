using FluentValidation;

namespace DoeVida.Application.UseCases.RegisterDonor;

public class RegisterDonorValidator : AbstractValidator<RegisterDonorCommand>
{
    public RegisterDonorValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Weight).GreaterThan(50);
    }

}
