using System;

namespace Domain
{
  //join table - AppUser and Activity won't actually be stored in table
  //must let 
  public class UserActivity
  {
    //AppUser
    public string AppUserId { get; set; }
    public virtual AppUser AppUser { get; set; }

    //Activity
    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; }
    
    //Additional properties
    public DateTime DateJoined { get; set; }
    public bool IsHost { get; set; }
  }
}