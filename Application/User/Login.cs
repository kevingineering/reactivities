using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity; //UserManager, SignInManager

namespace Application.User
{
  public class Login
  {
    //UserDTO is return type of interface
    //note that we are returning UserDTO, not AppUser
    public class Query : IRequest<UserDTO>
    {
      //what user needs to send
      public string Email { get; set; }
      public string Password { get; set; }
    }

    //end request if email or password is missing
    public class QueryValidator : AbstractValidator<Query>
    {
      public QueryValidator()
      {
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Query, UserDTO>
    {
      private readonly UserManager<Domain.AppUser> _userManager;
      private readonly SignInManager<Domain.AppUser> _signInManager;
      private readonly Application.Interfaces.IJwtGenerator _jwtGenerator;

      public Handler(UserManager<Domain.AppUser> userManager, SignInManager<Domain.AppUser> signInManager, Application.Interfaces.IJwtGenerator jwtGenerator)
      {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtGenerator = jwtGenerator;
      }

      public async Task<UserDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        //get user by email
        var user = await _userManager.FindByEmailAsync(request.Email);

        //if no email, return 401 status code
        if (user == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.Unauthorized);
        }

        //check password
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        //if password succeeded, return token
        if (result.Succeeded)
        {
            //TODO - return token
            return new UserDTO {
              DisplayName = user.DisplayName,
              Token = _jwtGenerator.CreateToken(user),
              UserName = user.UserName,
              Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
            };
        }
        else //if password failed, return 401 
        {
            throw new Application.Errors.RestException(HttpStatusCode.Unauthorized);
        }
      }
    }
  }
}