using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
  public class Details
  {
    public class Query : IRequest<Profile>
    {
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, Profile>
    {
      private readonly Persistence.DataContext _context;
      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
      {
        //get user
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

        //verify user exists
        if (user == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { user = "User not found." });
        }

        //create profile
        var profile = new Profile
        {
            DisplayName = user.DisplayName,
            UserName = user.UserName,
            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Bio = user.Bio,
            Photos = user.Photos
        };

        return profile;
      }
    }
  }
}