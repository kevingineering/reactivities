using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
  public class ProfileReader : IProfileReader
  {
    private readonly Persistence.DataContext _context;
    private readonly Application.Interfaces.IUserAccessor _userAccessor;

    public ProfileReader(Persistence.DataContext context, Application.Interfaces.IUserAccessor userAccessor)
    {
      _userAccessor = userAccessor;
      _context = context;
    }

    public async Task<Profile> ReadProfile(string userName)
    {
      //get target user 
      var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == userName);

      if (target == null)
      {
        throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { User = "Not found." });
      }

      //get current user
      var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

      //create profile
      var profile = new Profile
      {
        DisplayName = target.DisplayName,
        UserName = target.UserName,
        Image = target.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        Bio = target.Bio,
        Photos = target.Photos,
        FollowersCount = target.Followers.Count(),
        FollowingCount = target.Followings.Count()
      };

      //determine if following user 
      if (user.Followings.Any(x => x.TargetId == target.Id))
      {
          profile.IsFollowed = true;
      }
      else 
      {
          profile.IsFollowed = false;
      }

      return profile;
    }
  }
}