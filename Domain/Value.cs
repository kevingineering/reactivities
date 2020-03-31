namespace Domain
{
  //Domain contains business entities
  public class Value
  {
    //auto implemented properties - a concise way of declaring a property when no additional logic is required in property accessors (getters and setters)
    //Id will be primary key and will autoincrement with EF
    public int Id { get; set; }
    public string Name { get; set; }
  }
}
