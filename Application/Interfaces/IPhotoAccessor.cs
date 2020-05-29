using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
  public interface IPhotoAccessor
  {
    Application.Photos.PhotoUploadResult AddPhoto(IFormFile file);
    string DeletePhoto(string publicId);
  }
}