using System.Collections.Generic;
using Microsoft.AspNetCore.Identity; //IdentityUser

namespace Domain
{
  //note we are introducing dependency at domain layer
  public class AppUser : IdentityUser
  {
    //name displayed in app for user
    public string DisplayName { get; set; }

    //defines relationship between AppUser and UserActivity
    public virtual ICollection<UserActivity> UserActivities { get; set; }
  }
}