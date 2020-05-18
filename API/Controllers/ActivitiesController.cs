using System; //Guid
using System.Collections.Generic; //List
using System.Threading.Tasks; //Task
using MediatR; //IMediator
// using Microsoft.AspNetCore.Authorization; //Authorize - see Details Attributes
using Microsoft.AspNetCore.Mvc; //Route, ApiController, ControllerBase

namespace API.Controllers
{
  public class ActivitiesController : BaseController
  {
    [HttpGet]
    public async Task<ActionResult<List<Domain.Activity>>> List()
    {
      return await Mediator.Send(new Application.Activities.List.Query());
    }

    [HttpGet("{id}")]
    // [Authorize] - would be required 
    public async Task<ActionResult<Domain.Activity>> Details(Guid id)
    {
      return await Mediator.Send(new Application.Activities.Details.Query{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Application.Activities.Create.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Application.Activities.Edit.Command command)
    {
      //send id with command
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await Mediator.Send(new Application.Activities.Delete.Command{Id = id});
    }
  }
}