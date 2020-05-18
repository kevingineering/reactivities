using System; //DateTime
using System.Collections.Generic; //List
using System.IdentityModel.Tokens.Jwt; //JwtRegisteredClaimNames
using System.Security.Claims; //Claim
using System.Text; //Encoding
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens; //SymmetricSecurityKey, SigningCredentials, SecurityTokenDescriptor, JwtSecurityTokenHandler

namespace Infrastructure.Security
{
  public class JwtGenerator : Application.Interfaces.IJwtGenerator
  {
    private readonly SymmetricSecurityKey _key;

    public JwtGenerator(IConfiguration config)
    {
      //takes secret from dotnet user-secrets store and creates Key
      _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }

    public string CreateToken(Domain.AppUser user)
    {
      //claim is part of payload - here username
      var claims = new List<Claim>
      {
        new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
      };

      //generate signing credentials - creates unique signature so the server can validate a token is authentic
      var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

      //describe data about token
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(7),
        SigningCredentials = creds
      };

      //handler can create, validate, and write tokens
      var tokenHandler = new JwtSecurityTokenHandler();

      var token = tokenHandler.CreateToken(tokenDescriptor);

      return tokenHandler.WriteToken(token);
    }
  }
}