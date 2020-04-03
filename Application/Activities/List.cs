using System.Collections.Generic; //List
using System.Threading; //CancellationToken
using System.Threading.Tasks; //Task
using MediatR; //IRequest
using Microsoft.EntityFrameworkCore; //ToListAsync

namespace Application.Activities
{
  public class List
  {
    //get list of activities from database
    public class Query : IRequest<List<Domain.Activity>>
    {

    }

    //handler takes our query and type of what we return 
    public class Handler : IRequestHandler<Query, List<Domain.Activity>>
    {
      private readonly Persistence.DataContext _context;
      //inject data context
      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      //implement interface
      //cancellation token is sent when a user sends a request, but then either refreshes or leaves page
      public async Task<List<Domain.Activity>> Handle(Query request, CancellationToken cancellationToken)
      {
        var activities = await _context.Activities.ToListAsync();

        return activities;
      }
    }
  }
}