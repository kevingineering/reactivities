using System; //Guid
using System.Collections.Generic; //List
using System.Threading.Tasks; //Task
using MediatR; //IMediator
using Microsoft.AspNetCore.Mvc; //Route, ApiController, ControllerBase

namespace API.Controllers
{
  [Route("api/[controller]")]
  //ApiController automatically removes bad requests
  //ApiController also provides binding source parameter inference
  [ApiController]
  public class ActivitiesController : ControllerBase
  {
    private readonly IMediator _mediator;

    //injecting mediator
    public ActivitiesController(IMediator mediator)
    {
      _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<Domain.Activity>>> List()
    {
      return await _mediator.Send(new Application.Activities.List.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Activity>> Details(Guid id)
    {
      return await _mediator.Send(new Application.Activities.Details.Query{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Application.Activities.Create.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, Application.Activities.Edit.Command command)
    {
      //send id with command
      command.Id = id;
      return await _mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
      return await _mediator.Send(new Application.Activities.Delete.Command{Id = id});
    }
  }
}