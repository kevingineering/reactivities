using FluentValidation; //IRuleBuilder

namespace Application.Validators
{
    //static because class is extension method - will not be instantiating new version of class
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(8).WithMessage("Password must have at least eight characters.")
                //matches takes regular expression 
                .Matches("[A-Z]").WithMessage("Password must contain upper case letter.")
                .Matches("[a-z]").WithMessage("Password must contain lower case letter.")
                .Matches("[0-9]").WithMessage("Password must contain number.")
                .Matches("[^a-zA-Z)-9]").WithMessage("Password must contain non-alphanumeric character (e.g. #, $, !).");

            return options;
        }
    }
}