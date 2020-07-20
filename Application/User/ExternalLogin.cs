using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
  public class ExternalLogin
  {
    public class Query : IRequest<UserDTO>
    {
      public string AccessToken { get; set; }
    }

    public class Handler : IRequestHandler<Query, UserDTO>
    {
      private readonly IFacebookAccessor _fbAccessor;
      private readonly UserManager<AppUser> _userManager;
      private readonly Application.Interfaces.IJwtGenerator _jwtGenerator;

      public Handler(
        UserManager<AppUser> userManager,
        IFacebookAccessor fbAccessor,
        Application.Interfaces.IJwtGenerator jwtGenerator)
      {
        _jwtGenerator = jwtGenerator;
        _userManager = userManager;
        _fbAccessor = fbAccessor;
      }

      public async Task<UserDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        var fbUser = await _fbAccessor.FacebookLogin(request.AccessToken);

        if (fbUser == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token." });
        }

        var user = await _userManager.FindByEmailAsync(fbUser.Email);

        if (user == null)
        {
          user = new AppUser
          {
            DisplayName = fbUser.Name,
            Id = fbUser.Id,
            UserName = "fb_" + fbUser.Id,
            Email = fbUser.Email
          };

          var photo = new Photo
          {
            Id = "fb_" + fbUser.Id,
            Url = fbUser.Picture.Data.Url,
            IsMain = true
          };

          user.Photos.Add(photo);

          var result = await _userManager.CreateAsync(user);

          if (!result.Succeeded)
          {
            throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { User = "Problem creating user." });
          }
        }

        return new UserDTO
        {
          DisplayName = user.DisplayName,
          Token = _jwtGenerator.CreateToken(user),
          UserName = user.UserName,
          Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
        };
      }
    }
  }
}