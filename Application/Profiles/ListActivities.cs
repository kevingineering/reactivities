using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
  public class ListActivities
  {
    public class Query : IRequest<List<UserActivityDTO>>
    {
      public string UserName { get; set; }
      public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<UserActivityDTO>>
    {
      private readonly Persistence.DataContext _context;

      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      public async Task<List<UserActivityDTO>> Handle(Query request,
          CancellationToken cancellationToken)
      {
        //get user
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

        if (user == null)
          throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

        //get user activities sorted by date
        var queryable = user.UserActivities
            .OrderBy(a => a.Activity.Date)
            .AsQueryable();

        //filter user activities
        switch (request.Predicate)
        {
          case "past":
            queryable = queryable.Where(a => a.Activity.Date <= DateTime.Now);
            break;
          case "hosting":
            queryable = queryable.Where(a => a.IsHost);
            break;
          default:
            queryable = queryable.Where(a => a.Activity.Date >= DateTime.Now);
            break;
        }

        //create list, notice not using mapper
        var activities = queryable.ToList();
        var activitiesToReturn = new List<UserActivityDTO>();

        foreach (var activity in activities)
        {
          var userActivity = new UserActivityDTO
          {
            Id = activity.Activity.Id,
            Title = activity.Activity.Title,
            Category = activity.Activity.Category,
            Date = activity.Activity.Date
          };

          activitiesToReturn.Add(userActivity);
        }

        return activitiesToReturn;
      }
    }
  }
}