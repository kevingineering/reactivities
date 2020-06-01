using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class PhotosController : BaseController
  {
    [HttpPost]
    public async Task<ActionResult<Domain.Photo>> Add([FromForm] Application.Photos.Add.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(string id)
    {
      return await Mediator.Send(new Application.Photos.Delete.Command { Id = id });
    }

    [HttpPost("setmain/{id}")]
    public async Task<ActionResult<Unit>> SetMain(string id)
    {
      return await Mediator.Send(new Application.Photos.SetMain.Command { Id = id });
    }
  }
}