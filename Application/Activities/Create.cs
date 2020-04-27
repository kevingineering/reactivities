using System; //Guid, DateTime
using System.Threading;
using System.Threading.Tasks;
using MediatR; //IRequest
using FluentValidation; //AbstractValidator

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
      //inject data context
      public Handler(Persistence.DataContext context)
      {
        _context = context;
      }

      //return Unit, not anything to do with activity
      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
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

        _context.Add(activity);

        //SaveChangesAsync returns and int, so we check to make sure that at least one change has occured
        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}