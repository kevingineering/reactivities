using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
  public class Unattend
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly Persistence.DataContext _context;
      private readonly Application.Interfaces.IUserAccessor _userAccessor;
      public Handler(Persistence.DataContext context, Application.Interfaces.IUserAccessor userAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        //get activity and ensure not null
        var activity = await _context.Activities.FindAsync(request.Id);
        if (activity == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { activity = "Activity not found." });
        }

        //get user - can't be null because token is required
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

        //see if attendance already exists 
        var attendance = await _context.UserActivities
            .SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.AppUserId == user.Id);
        if (attendance == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { attendance = "User not attending activity." });
        }

        //ensure host does not leave activity
        if (attendance.IsHost)
        {
          throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { attendance = "Host must attend activity." });
        }

        //delete attendance
        _context.UserActivities.Remove(attendance);

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}