using System;
using System.Collections.Generic; //List
using System.Linq;
using System.Threading; //CancellationToken
using System.Threading.Tasks; //Task
using AutoMapper;
using MediatR; //IRequest
using Microsoft.EntityFrameworkCore; //ToListAsync, Include

namespace Application.Activities
{
  public class List
  {
    public class ActivitiesEnvelope
    {
      public List<ActivityDTO> Activities { get; set; }
      public int ActivityCount { get; set; }
    }

    //get list of activities from database
    public class Query : IRequest<ActivitiesEnvelope>
    {
      public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
      {
        Limit = limit;
        Offset = offset;
        IsGoing = isGoing;
        IsHost = isHost;
        StartDate = startDate ?? DateTime.Now;
      }

      public int? Limit { get; set; }
      public int? Offset { get; set; }
      public bool IsGoing { get; set; }
      public bool IsHost { get; set; }
      public DateTime? StartDate { get; set; }
    }

    //handler takes our query and type of what we return 
    public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
    {
      private readonly Persistence.DataContext _context;
      private readonly IMapper _mapper;
      private readonly Application.Interfaces.IUserAccessor _userAccessor;

      //inject data context
      public Handler(Persistence.DataContext context, IMapper mapper, Application.Interfaces.IUserAccessor userAccessor)
      {
        _context = context;
        _mapper = mapper;
        _userAccessor = userAccessor;
      }

      //implement interface
      //cancellation token is sent when a user sends a request, but then either refreshes or leaves page
      public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
      {
        //get IQueryable of activities sorted by date
        var queryable = _context.Activities
          .Where(a => a.Date >= request.StartDate)
          .OrderBy(a => a.Date)
          .AsQueryable();

        //get activities user is attending
        if (request.IsGoing && !request.IsHost)
        {
          queryable = queryable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUserName()));
        }

        if (request.IsHost)
        {
          queryable = queryable.Where(x => x.UserActivities.Any(a => a.IsHost && a.AppUser.UserName == _userAccessor.GetCurrentUserName()));
        }

        var activities = await queryable
          .Skip(request.Offset ?? 0)
          .Take(request.Limit ?? 3)
          .ToListAsync();

        return new ActivitiesEnvelope
        {
          Activities = _mapper.Map<List<Domain.Activity>, List<ActivityDTO>>(activities),
          ActivityCount = queryable.Count()
        };

        //eager loading related data - when we get activities, we also get user activities and app users - requires include statement
        // var activities = await _context.Activities
        // .Include(x => x.UserActivities)
        // .ThenInclude(x => x.AppUser)
        // .ToListAsync();

        //lazy loading related data
        // var activities = await _context.Activities.ToListAsync();
      }
    }
  }
}