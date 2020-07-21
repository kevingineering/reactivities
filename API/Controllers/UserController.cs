using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; //AllowAnonymous, Authorize
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Linq;

namespace API.Controllers
{
  public class UserController : BaseController
  {
    private readonly IConfiguration _config;

    public UserController(IConfiguration config)
    {
      _config = config;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<Application.User.UserDTO>> Login(Application.User.Login.Query query)
    {
      return await Mediator.Send(query);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<Application.User.UserDTO>> Register(Application.User.Register.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<Application.User.UserDTO>> CurrentUser()
    {
      return await Mediator.Send(new Application.User.CurrentUser.Query());
    }

    [AllowAnonymous]
    [HttpPost("facebook")]
    public async Task<ActionResult<Application.User.UserDTO>> FbLogin(Application.User.ExternalLogin.Query query)
    {
      return await Mediator.Send(query);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<Application.User.UserDTO>> RefreshToken(Application.User.RefreshToken.Query query)
    {
      var principal = GetPrincipalFromExpiredToken(query.Token);
      query.UserName = principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
      return await Mediator.Send(query);
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
      //tell API what to validate when receiving token - see Startup 
      var tokenValidationParameters = new TokenValidationParameters
      {
        ValidateAudience = false, //could be url it comes from 
        ValidateIssuer = false, //would be local host or servicer
        ValidateIssuerSigningKey = true, //check signing key first to make sure token originated here
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])), //key used to create token
        ValidateLifetime = false, //we know token is expired, that's why we're here
      };

      var tokenHandler = new JwtSecurityTokenHandler();

      var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

      var jwtSecurityToken = securityToken as JwtSecurityToken;

      if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
      {
        throw new SecurityTokenException("Invalid Token");
      }

      return principal;
    }
  }
}