using System; //Guid, DateTime
using System.Collections.Generic;

namespace Domain
{
  public class Activity
  {
    //Guid allows us to create the ID from either the server-side or client-side code
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string Category { get; set; }

    public DateTime Date { get; set; }

    public string City { get; set; }

    public string Venue { get; set; }

    //defines relationship between AppUser and UserActivity
    //virtual keyword is required for lazy loading
    public virtual ICollection<UserActivity> UserActivities { get; set; }

    public virtual ICollection<Comment> Comments { get; set; }
  }
}