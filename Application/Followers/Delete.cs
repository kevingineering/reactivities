using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
  public class Delete
  {
    public class Command : IRequest
    {
      public string UserName { get; set; } //of target
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
        //get user and target
        var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

        var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

        if (target == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { user = "User not found." });
        }

        //attempt to find 
        var following = await _context.Followings.SingleOrDefaultAsync(x => x.TargetId == target.Id && x.ObserverId == observer.Id);

        if (following == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { following = "You are not following this user." });
        }

        //delete following
        _context.Followings.Remove(following);

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}