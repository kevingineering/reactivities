using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Identity; //IdentityUser

namespace Domain
{
  //note we are introducing dependency at domain layer
  public class AppUser : IdentityUser
  {
    //instantiate new users with photos collection so if they join via FB we have a place to store their profile pic
    public AppUser()
    {
      Photos = new Collection<Photo>();
    }

    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpiry { get; set; }

    //relationships
    public virtual ICollection<UserActivity> UserActivities { get; set; }
    public virtual ICollection<Photo> Photos { get; set; }
    public virtual ICollection<UserFollowing> Followings { get; set; }
    public virtual ICollection<UserFollowing> Followers { get; set; }

  }
}