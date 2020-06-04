using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Application.Profiles
{
  public class Profile
  {
    public string DisplayName { get; set; }
    public string UserName { get; set; }
    public string Image { get; set; }
    public string Bio { get; set; }

    [JsonPropertyName("isFollowing")]
    public bool IsFollowed { get; set; }
    public ICollection<Domain.Photo> Photos { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
  }
}