using Microsoft.EntityFrameworkCore; //DbContext, DbContextOptions, DbSet

namespace Persistence
{
  //DbContext represents session with database
  public class DataContext : DbContext
  {
    //constructor
    //base(options) - https://stackoverflow.com/questions/54779492/definition-of-entity-framework-context-base-options
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    //entity we are using - Values is table name in SQL
    public DbSet<Domain.Value> Values { get; set; }

    //adding data to database when migration is created
    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.Entity<Domain.Value>().HasData(
        new Domain.Value { Id = 1, Name = "Value 101"},
        new Domain.Value { Id = 2, Name = "Value 102"},
        new Domain.Value { Id = 3, Name = "Value 103"}
      );
    }
  }
}
