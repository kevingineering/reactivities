using System; //Guid
using System.Threading.Tasks; //Task
using MediatR; //IMediator
using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Authorization; //Authorize - see Details Attributes
using Microsoft.AspNetCore.Mvc; //Route, ApiController, ControllerBase

namespace API.Controllers
{
  public class ActivitiesController : BaseController
  {
    [HttpGet]
    public async Task<ActionResult<Application.Activities.List.ActivitiesEnvelope>> List(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
    {
      return await Mediator.Send(new Application.Activities.List.Query(limit, offset, isGoing, isHost, startDate));
    }

    [HttpGet("{id}")] //id available as variable
    // [Authorize] - would be required 
    public async Task<ActionResult<Application.Activities.ActivityDTO>> Details(Guid id)
    {
      return await Mediator.Send(new Application.Activities.Details.Query {Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Application.Activities.Create.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpPost("attend/{id}")]
    public async Task<ActionResult<Unit>> Attend(Guid id)
    {
      return await Mediator.Send(new Application.Activities.Attend.Command {Id = id});
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Application.Activities.Edit.Command command)
    {
      //send id with command
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await Mediator.Send(new Application.Activities.Delete.Command {Id = id});
    }

    [HttpDelete("attend/{id}")]
    public async Task<ActionResult<Unit>> Unattend(Guid id)
    {
      return await Mediator.Send(new Application.Activities.Unattend.Command {Id = id});
    }
  }
}