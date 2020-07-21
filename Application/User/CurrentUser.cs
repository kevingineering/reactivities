using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
  public class CurrentUser
  {
    public class Query : IRequest<UserDTO>
    {
    }

    public class Handler : IRequestHandler<Query, UserDTO>
    {
      private readonly UserManager<Domain.AppUser> _userManager;
      private readonly Application.Interfaces.IUserAccessor _userAccessor;
      private readonly Application.Interfaces.IJwtGenerator _jwtGenerator;

      public Handler(
        UserManager<Domain.AppUser> userManager,
        Application.Interfaces.IUserAccessor userAccessor,
        Application.Interfaces.IJwtGenerator jwtGenerator
      )
      {
        _userManager = userManager;
        _userAccessor = userAccessor;
        _jwtGenerator = jwtGenerator;
      }

      public async Task<UserDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUserName());

        return new UserDTO
        {
          DisplayName = user.DisplayName,
          Token = _jwtGenerator.CreateToken(user),
          RefreshToken = user.RefreshToken,
          UserName = user.UserName,
          Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        };
      }
    }
  }
}