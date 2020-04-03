using System; //Guid, DateTime

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
  }
}