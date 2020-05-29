using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
  public class SetMain
  {
    public class Command : IRequest
    {
      public string Id { get; set; }
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
        //get user
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        //get photo
        var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

        //ensure photo exists (also caught if photo not owned by user)
        if (photo == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { photo = "Photo not found." });
        }
        
        //get main photo
        var mainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);

        //change main
        mainPhoto.IsMain = false;
        photo.IsMain = true;

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}