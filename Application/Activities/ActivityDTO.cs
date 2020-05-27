using System;
using System.Collections.Generic;
using System.Text.Json.Serialization; //JsonPropertyName

namespace Application.Activities
{
  public class ActivityDTO
  {
    //Guid allows us to create the ID from either the server-side or client-side code
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string Category { get; set; }

    public DateTime Date { get; set; }

    public string City { get; set; }

    public string Venue { get; set; }

    //note user activities has changed from collection of UserActivity to collection of AttendeeDTO
    //JsonPropertyName changes returned name from UserActivities (the name required for automapping) to attendees
    [JsonPropertyName("attendees")]
    public ICollection<AttendeeDTO> UserActivities { get; set; }

  }
}