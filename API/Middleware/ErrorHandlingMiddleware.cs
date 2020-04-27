using System; //Exception
using System.Net; //HttpStatusCode
using System.Text.Json; //JsonSerializer
using System.Threading.Tasks; //Task
using Microsoft.AspNetCore.Http; //RequestDelegate, HttpContext
using Microsoft.Extensions.Logging; //ILogger

namespace API.Middleware
{
  public class ErrorHandlingMiddleware
  {
    private readonly RequestDelegate _next;

    //log what is going on here to terminal window
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    //constructor - injecting _logger and _next
    //requestdelegate is what gets sent between middleware
    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
      _logger = logger;
      _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
      try
      {
        //if no exception, pass request to next middleware
        await _next(context);
      }
      catch (Exception ex)
      {
        //if exception, call private method
        await HandleExceptionAsync(context, ex, _logger);
      }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
    {
      object errors = null;

      switch (ex)
      {
        case Application.Errors.RestException re:
          logger.LogError(ex, "REST ERROR");
          errors = re.Errors;
          context.Response.StatusCode = (int)re.Code;
          break;
        case Exception e:
          logger.LogError(ex, "SERVER ERROR");
          errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
          context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
          break;
      }

      //give response a content type of json
      context.Response.ContentType = "application/json";

      //if there are errors, 
      //note that we no longer need newtonsoft
      if (errors != null)
      {
        //create new JSON object
        var result = JsonSerializer.Serialize(new
        {
          errors
        });

        //writes response body
        await context.Response.WriteAsync(result);
      }
    }
  }
}