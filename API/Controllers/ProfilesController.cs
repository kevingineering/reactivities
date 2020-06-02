using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class ProfilesController : BaseController
  {
    [HttpGet("{username}")]
    public async Task<ActionResult<Application.Profiles.Profile>> Details(string userName)
    {
      return await Mediator.Send(new Application.Profiles.Details.Query { UserName = userName });
    }

    [HttpPut]
    public async Task<ActionResult<Unit>> Update(Application.Profiles.Update.Command command)
    {
      return await Mediator.Send(command);
    }
  }
}