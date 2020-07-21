using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
  public class RefreshToken
  {
    public class Query : IRequest<UserDTO>
    {
      public string UserName { get; set; }
      public string Token { get; set; }
      public string RefreshToken { get; set; }
    }

    public class Handler : IRequestHandler<Query, UserDTO>
    {
      private readonly UserManager<Domain.AppUser> _userManager;
      private readonly IJwtGenerator _jwtGenerator;

      public Handler(UserManager<Domain.AppUser> userManager, IJwtGenerator jwtGenerator)
      {
        _jwtGenerator = jwtGenerator;
        _userManager = userManager;
      }

      public async Task<UserDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _userManager.FindByNameAsync(request.UserName);

        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiry < DateTime.Now)
        {
          throw new Application.Errors.RestException(HttpStatusCode.Unauthorized);
        }

        user.RefreshToken = _jwtGenerator.CreateRefreshToken();
        user.RefreshTokenExpiry = DateTime.Now.AddDays(30);
        await _userManager.UpdateAsync(user);

        return new UserDTO
        {
          DisplayName = user.DisplayName,
          UserName = user.UserName,
          Token = _jwtGenerator.CreateToken(user),
          RefreshToken = user.RefreshToken,
          Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        };
      }
    }
  }
}