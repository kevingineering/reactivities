using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
  public class PhotoAccessor : Application.Interfaces.IPhotoAccessor
  {
    private readonly Cloudinary _cloudinary;

    //gets access to settings in user secrets
    public PhotoAccessor(IOptions<CloudinarySettings> config)
    {
      var acc = new Account(
        config.Value.CloudName,
        config.Value.ApiKey,
        config.Value.ApiSecret
      );

      _cloudinary = new Cloudinary(acc);
    }

    public Application.Photos.PhotoUploadResult AddPhoto(IFormFile file)
    {
      var uploadResult = new ImageUploadResult();

      //if file exists, read file into memory - using lets us dispose of it once finished
      if (file.Length > 0)
      {
        using (var stream = file.OpenReadStream())
        {
          var uploadParams = new ImageUploadParams()
          {
            File = new FileDescription(file.FileName, stream),
            //sets image size and crops centered on face
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
          };
          uploadResult = _cloudinary.Upload(uploadParams);
        }
      }

      //check result for errors
      if (uploadResult.Error != null)
      {
        throw new System.Exception(uploadResult.Error.Message);
      }

      return new Application.Photos.PhotoUploadResult
      {
        PublicId = uploadResult.PublicId,
        Url = uploadResult.SecureUrl.AbsoluteUri //download url of new photo
      };
    }

    public string DeletePhoto(string publicId)
    {
      var deleteParams = new DeletionParams(publicId);

      var result = _cloudinary.Destroy(deleteParams);

      //returns ok if no errors, can catch errors with null
      return result.Result == "ok" ? result.Result : null;
    }
  }
}