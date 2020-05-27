using System; //Guid, DateTime
using System.Threading;
using System.Threading.Tasks;
using MediatR; //IRequest
using FluentValidation; //AbstractValidator
using Microsoft.EntityFrameworkCore; //SingleOrDefaultAsync

namespace Application.Activities
{
  public class Create
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }
      public string Category { get; set; }
      public DateTime Date { get; set; }
      public string City { get; set; }
      public string Venue { get; set; }
    }

    //Validation using FluentValidation
    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.Date).NotEmpty();
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Venue).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly Persistence.DataContext _context;
      private readonly Application.Interfaces.IUserAccessor _userAccessor;

      //inject dependencies
      public Handler(Persistence.DataContext context, Application.Interfaces.IUserAccessor userAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;
      }

      //return Unit, not anything to do with activity
      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        //compose activity
        var activity = new Domain.Activity
        {
          Id = request.Id,
          Title = request.Title,
          Description = request.Description,
          Category = request.Category,
          Date = request.Date,
          City = request.City,
          Venue = request.Venue
        };

        //add activity to DB
        _context.Add(activity);

        //get user from DB
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        //create attendee - notice AppUserId and ActivityId are not required 
        var attendee = new Domain.UserActivity {
          AppUser = user,
          Activity = activity,
          DateJoined = DateTime.Now,
          IsHost = true
        };

        //add attendee to database
        _context.UserActivities.Add(attendee);

        //SaveChangesAsync returns and int, so we check to make sure that at least one change has occured
        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}