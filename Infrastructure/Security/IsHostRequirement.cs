using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
  public class IsHostRequirement : IAuthorizationRequirement
  {

  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly Persistence.DataContext _context;

    public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, Persistence.DataContext context)
    {
      _context = context;
      _httpContextAccessor = httpContextAccessor;

    }

    //overwrite abstract class on AuthorizationHandler
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
      //get username from httpcontext
      var currentUsername = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

      //Id stored as Guid in database but passed as string in route params
      //RouteValues are key-value pairs, we will have "id" key, single or default gets pair and we then get value
      var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

      var activity = _context.Activities.FindAsync(activityId).Result;

      var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

      if (host?.AppUser?.UserName == currentUsername)
      {
        context.Succeed(requirement);
      }

      return Task.CompletedTask;
    }
  }
}