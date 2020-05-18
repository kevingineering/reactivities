using Microsoft.AspNetCore.Identity.EntityFrameworkCore; //IdentityDbContext, OnModelCreating, base
using Microsoft.EntityFrameworkCore; //DbContext, DbContextOptions, DbSet, ModelBuilder

namespace Persistence
{
  //DbContext represents session with database
  // public class DataContext : DbContext //what we used before identity
  public class DataContext : IdentityDbContext<Domain.AppUser>
  {
    //constructor
    //base(options) - https://stackoverflow.com/questions/54779492/definition-of-entity-framework-context-base-options
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    //entity we are using - Values is table name in SQL
    //AppUser is not required as DbSet because it is passed in at the class level
    public DbSet<Domain.Value> Values { get; set; }
    public DbSet<Domain.Activity> Activities { get; set; }

    //adding data to database when migration is created
    protected override void OnModelCreating(ModelBuilder builder)
    {
      //gives AppUser primary key of string during migration
      base.OnModelCreating(builder); //added with identity

      builder.Entity<Domain.Value>().HasData(
        new Domain.Value { Id = 1, Name = "Value 101" },
        new Domain.Value { Id = 2, Name = "Value 102" },
        new Domain.Value { Id = 3, Name = "Value 103" }
      );
    }
  }
}
