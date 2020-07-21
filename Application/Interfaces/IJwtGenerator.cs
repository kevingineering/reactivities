namespace Application.Interfaces
{
  public interface IJwtGenerator
  {
    string CreateRefreshToken();
    string CreateToken(Domain.AppUser user);
  }
}