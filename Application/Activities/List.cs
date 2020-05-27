using System.Collections.Generic; //List
using System.Threading; //CancellationToken
using System.Threading.Tasks; //Task
using AutoMapper;
using MediatR; //IRequest
using Microsoft.EntityFrameworkCore; //ToListAsync, Include

namespace Application.Activities
{
  public class List
  {
    //get list of activities from database
    public class Query : IRequest<List<ActivityDTO>>
    {

    }

    //handler takes our query and type of what we return 
    public class Handler : IRequestHandler<Query, List<ActivityDTO>>
    {
      private readonly Persistence.DataContext _context;
      private readonly IMapper _mapper;
      //inject data context
      public Handler(Persistence.DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      //implement interface
      //cancellation token is sent when a user sends a request, but then either refreshes or leaves page
      public async Task<List<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
      {
        //eager loading related data - when we get activities, we also get user activities and app users - requires include statement
        var activities = await _context.Activities
          // .Include(x => x.UserActivities)
          // .ThenInclude(x => x.AppUser)
          .ToListAsync();

        var returnList = _mapper.Map<List<Domain.Activity>, List<ActivityDTO>>(activities);
        return returnList;
      }
    }
  }
}