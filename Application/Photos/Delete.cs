using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
  public class Delete
  {
    public class Command : IRequest
    {
      public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly Persistence.DataContext _context;
      private readonly Application.Interfaces.IUserAccessor _userAccessor;
      private readonly Application.Interfaces.IPhotoAccessor _photoAccessor;

      public Handler(Persistence.DataContext context, Application.Interfaces.IUserAccessor userAccessor, Application.Interfaces.IPhotoAccessor photoAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;
        _photoAccessor = photoAccessor;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        //get user
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

        //get photo from user photos
        var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

        //ensure photo exists (also caught if photo not owned by user)
        if (photo == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { photo = "Photo not found." });
        }

        //don't delete photo if it is the user's main photo
        if (photo.IsMain)
        {
            throw new Application.Errors.RestException(HttpStatusCode.BadRequest, new { photo = "You cannot delete your main photo." });
        }

        //delete photo on Cloudinary
        var result = _photoAccessor.DeletePhoto(photo.Id);

        //ensure deletion worked
        if (result == null)
        {
            throw new Exception("Problem deleting the photo.");
        }

        //delete photo in database
        user.Photos.Remove(photo);

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}