using Microsoft.AspNetCore.Mvc; //Route, ApiController, Http methods, FromBody, ActionResult, and ControllerBase
using MediatR; //IMediator
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
  //attribute based routing - api/values - 'values' comes from name 'ValuesController'
  //ApiController automatically removes bad requests
  //ApiController also provides binding source parameter inference
  [Route("api/[controller]")]
  [ApiController]
  public class BaseController : ControllerBase
  {
    private IMediator _mediator;
    
    //returns private field if it is not null, otherwise gets instance of mediator from service 
    protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
  }
}