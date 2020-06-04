using System.Linq;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
  public class FollowingResolver : IValueResolver<Domain.UserActivity, AttendeeDTO, bool>
  {
    private readonly Persistence.DataContext _context;
    private readonly Application.Interfaces.IUserAccessor _userAccessor;

    public FollowingResolver(Persistence.DataContext context, Application.Interfaces.IUserAccessor userAccessor)
    {
      _context = context;
      _userAccessor = userAccessor;
    }

    public bool Resolve(UserActivity source, AttendeeDTO destination, bool destMember, ResolutionContext context)
    {
      //get user
      var user = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName()).Result;

      if(user.Followings.Any(x => x.TargetId == source.AppUserId))
      {
        return true;
      }
      return false;
    }
  }
}