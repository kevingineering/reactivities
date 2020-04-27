using System; //Guid
using System.Net; //HttpStatusCode
using System.Threading; //CancellationToken
using System.Threading.Tasks; //Task
using MediatR; //IRequest, IRequestHandler

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

      public async Task<Domain.Activity> Handle(Query request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Id);

        //throw custom exception if activity is not found
        if (activity == null)
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new {activity = "Not found."});

        return activity;
      }
    }
  }
}