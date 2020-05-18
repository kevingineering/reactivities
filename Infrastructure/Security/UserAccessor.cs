using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http; //IHttpContextAccessor

namespace Infrastructure.Security
{
  public class UserAccessor : Application.Interfaces.IUserAccessor
  {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserAccessor(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    //get username from token
    public string GetCurrentUsername()
    {
      //checks HttpContext for User object. If User exists, check it for Claims. If Claims exist, get Claim type with Name Identifier (which is what username is), then get its value. 
      var item1 = _httpContextAccessor;
      var item2 = _httpContextAccessor.HttpContext;
      var item3 = _httpContextAccessor.HttpContext.User;
      var item4 =  _httpContextAccessor.HttpContext.User?.Claims;
      var username = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
      
      return username;
    }
  }
}