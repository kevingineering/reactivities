using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class FollowingController : BaseController
  {
    [HttpPost("{username}")]
    public async Task<ActionResult<Unit>> Follow(string userName)
    {
      return await Mediator.Send(new Application.Followers.Add.Command { UserName = userName });
    }

    [HttpDelete("{username}")]
    public async Task<ActionResult<Unit>> Delete(string userName)
    {
      return await Mediator.Send(new Application.Followers.Delete.Command { UserName = userName });
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<List<Application.Profiles.Profile>>> GetFollowings(string userName, string predicate)
    {
      return await Mediator.Send(new Application.Followers.List.Query{UserName = userName, Predicate = predicate});
    }
  }
}