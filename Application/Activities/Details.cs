using System; //Guid
using System.Net; //HttpStatusCode
using System.Threading; //CancellationToken
using System.Threading.Tasks; //Task
using AutoMapper; //IMapper
using MediatR; //IRequest, IRequestHandler
using Microsoft.EntityFrameworkCore; //Include 

namespace Application.Activities
{
  public class Details
  {
    //get single activity from database
    public class Query : IRequest<ActivityDTO>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, ActivityDTO>
    {
      private readonly Persistence.DataContext _context;
      private readonly IMapper _mapper;

      public Handler(Persistence.DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<ActivityDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        //eager loading related data requires include statements and SingleOrDefaultAsync method
        var activity = await _context.Activities
            // .Include(x => x.UserActivities)
            // .ThenInclude(x => x.AppUser)
            // .SingleOrDefaultAsync(x => x.Id == request.Id);
            .FindAsync(request.Id);


        //throw custom exception if activity is not found
        if (activity == null)
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { activity = "Activity not found." });

        var returnActivity = _mapper.Map<Domain.Activity, ActivityDTO>(activity);
        return returnActivity;
      }
    }
  }
}