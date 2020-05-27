using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; //AllowAnonymous, Authorize

namespace API.Controllers
{
  public class UserController : BaseController
  {
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<Application.User.UserDTO>> Login(Application.User.Login.Query query)
    {
      return await Mediator.Send(query);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<Application.User.UserDTO>> Register(Application.User.Register.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<Application.User.UserDTO>> CurrentUser()
    {
      return await Mediator.Send(new Application.User.CurrentUser.Query());
    }
  }
}