using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
  public class Add
  {
    public class Command : IRequest<Domain.Photo>
    {
      public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Domain.Photo>
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

      public async Task<Domain.Photo> Handle(Command request, CancellationToken cancellationToken)
      {
        //upload photo (errors caught by PhotoAccessor)
        var photoUploadResult = _photoAccessor.AddPhoto(request.File);

        //get user
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

        //create photo
        var photo = new Domain.Photo {
            Id = photoUploadResult.PublicId,
            Url = photoUploadResult.Url
        };

        //if user has no main photos, use this one
        if (!user.Photos.Any(x => x.IsMain))
        {
            photo.IsMain = true;
        }

        //save to database - updates user and adds photo
        user.Photos.Add(photo);

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return photo;

        throw new Exception("Problem saving changes.");
      }
    }
  }
}