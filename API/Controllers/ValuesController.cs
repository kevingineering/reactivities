using System.Collections.Generic; //IEnumerable
using System.Threading.Tasks; //Task
using Microsoft.AspNetCore.Mvc; //Route, ApiController, Http methods, FromBody, ActionResult, and ControllerBase
using Microsoft.EntityFrameworkCore; //ToListAsync

namespace API.Controllers
{
  //attribute based routing - api/values - 'values' comes from name 'ValuesController'
  [Route("api/[controller]")]
  [ApiController]
  public class ValuesController : ControllerBase
  {
    //database context variable
    private readonly Persistence.DataContext _context;

    //constructor
    public ValuesController(Persistence.DataContext context)
    {
      _context = context;
    }

    // GET api/values
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Domain.Value>>> Get()
    {
      //asynchronously gets list from database
      var values = await _context.Values.ToListAsync();
      //returns 200 status code with database response
      return Ok(values);
    }

    // GET api/values/5
    //id is available as parameter
    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Value>> Get(int id)
    {
      //returns value or null
      var value = await _context.Values.FindAsync(id);
      return Ok(value);
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}