using System.Collections.Generic;
using Microsoft.AspNetCore.Identity; //IdentityUser

namespace Domain
{
  //note we are introducing dependency at domain layer
  public class AppUser : IdentityUser
  {
    public string DisplayName { get; set; }
    public string Bio { get; set; }

    //relationships
    public virtual ICollection<UserActivity> UserActivities { get; set; }
    public virtual ICollection<Photo> Photos { get; set; }
    public virtual ICollection<UserFollowing> Followings { get; set; }
    public virtual ICollection<UserFollowing> Followers { get; set; }

  }
}