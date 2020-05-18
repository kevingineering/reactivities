namespace Application.Interfaces
{
  public interface IJwtGenerator
  {
    string CreateToken(Domain.AppUser user);
  }
}