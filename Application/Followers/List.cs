using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
  public class List
  {
    public class Query : IRequest<List<Application.Profiles.Profile>>
    {
      public string UserName { get; set; }
      public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<Application.Profiles.Profile>>
    {
      private readonly Persistence.DataContext _context;
      private readonly Application.Profiles.IProfileReader _profileReader;

      public Handler(Persistence.DataContext context, Application.Profiles.IProfileReader profileReader)
      {
        _profileReader = profileReader;
        _context = context;
      }

      public async Task<List<Application.Profiles.Profile>> Handle(Query request, CancellationToken cancellationToken)
      {
        var queryable = _context.Followings.AsQueryable();

        var userFollowings = new List<Domain.UserFollowing>();

        var profiles = new List<Application.Profiles.Profile>();

        switch (request.Predicate)
        {
          case "followers":
            {
              userFollowings = await queryable.Where(x =>
              x.Target.UserName == request.UserName).ToListAsync();

              foreach (var follower in userFollowings)
              {
                profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
              }
              break;
            }
          case "followings":
            {
              userFollowings = await queryable.Where(x =>
              x.Observer.UserName == request.UserName).ToListAsync();

              foreach (var observer in userFollowings)
              {
                profiles.Add(await _profileReader.ReadProfile(observer.Target.UserName));
              }
              break;
            }
        }

        return profiles;
      }
    }
  }
}