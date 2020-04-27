using System; //Exception
using System.Net; //HttpStatusCode
using System.Threading; //CancellationToken
using System.Threading.Tasks; //Task
using FluentValidation; //AbstractValidator, RuleFor
using MediatR; //IRequest, IRequestHandler, Unit

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest
    {
      //Id is not editable, but we need it to complete our command - everything else is editable
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }
      public string Category { get; set; }
      public DateTime? Date { get; set; }
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

      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var activity = await _context.Activities.FindAsync(request.Id);

        if (activity == null)
          throw new Exception("Could not find activity.");

        //throw custom exception if activity is not found
        if (activity == null)
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { activity = "Not found." });

        //?? is null coalescing operator
        activity.Title = request.Title ?? activity.Title;
        activity.Description = request.Description ?? activity.Description;
        activity.Category = request.Category ?? activity.Category;
        //Added ? at end of date above so it can be optional, otherwise causes error because date cannot be null
        activity.Date = request.Date ?? activity.Date;
        activity.City = request.City ?? activity.City;
        activity.Venue = request.Venue ?? activity.Venue;

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}