using System; //Guid
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR; //IRequest

namespace Application.Activities
{
  public class Details
  {
    //get single activity from database
    public class Query : IRequest<Domain.Activity>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Domain.Activity>
    {
      private readonly Persistence.DataContext _context;
      //inject data context
      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Id);

        return activity;
      }
    }
  }
}