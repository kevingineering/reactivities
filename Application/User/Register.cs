using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Validators; //Password
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.User
{
  public class Register
  {
    public class Command : IRequest<UserDTO>
    {
      public string DisplayName { get; set; }
      public string Username { get; set; }
      public string Email { get; set; }
      public string Password { get; set; }
    }

    public class QueryValidator : AbstractValidator<Command>
    {
      public QueryValidator()
      {
        RuleFor(x => x.DisplayName).NotEmpty();
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).Password(); //custom validator
      }
    }

    public class Handler : IRequestHandler<Command, UserDTO>
    {
      private readonly UserManager<Domain.AppUser> _userManager;
      private readonly SignInManager<Domain.AppUser> _signInManager;
      private readonly Application.Interfaces.IJwtGenerator _jwtGenerator;
      private readonly Persistence.DataContext _context;

      public Handler(
        UserManager<Domain.AppUser> userManager,
        SignInManager<Domain.AppUser> signInManager,
        Application.Interfaces.IJwtGenerator jwtGenerator,
        Persistence.DataContext context)
      {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtGenerator = jwtGenerator;
        _context = context;
      }

      public async Task<UserDTO> Handle(Command request, CancellationToken cancellationToken)
      {
        //can't create user with existing email or username
        if (await _context.Users.Where(x => x.Email == request.Email).AnyAsync())
          throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });

        if (await _context.Users.Where(x => x.UserName == request.Username).AnyAsync())
          throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists." });
        
        //create new user
        var user = new Domain.AppUser
        {
          DisplayName = request.DisplayName,
          UserName = request.Username,
          Email = request.Email
        };

        //user manager automatically salts and hashes password
        var result = await _userManager.CreateAsync(user, request.Password);

        if(result.Succeeded) 
        {
          return new UserDTO 
          {
            DisplayName = user.DisplayName,
            Token = _jwtGenerator.CreateToken(user),
            Username = user.UserName,
            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
          };
        }
        else
        {
          throw new Exception("Problem creating user.");
        }
      }
    }
  }
}