using System;
using System.Net; //HttpStatusCode
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Application.Activities
{
  public class Delete
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly Persistence.DataContext _context;

      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Id);

        //throw custom exception if activity is not found
        if (activity == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new {activity = "Activity not found."});
        }

        _context.Remove(activity);
        
        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}