﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore; //IdentityDbContext, OnModelCreating, base
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

    //entity we are using - Activities is table name in SQL
    public DbSet<Domain.Activity> Activities { get; set; }
    //AppUser is not required as DbSet because it is passed in at the class level
    public DbSet<Domain.UserActivity> UserActivities { get; set; }
    public DbSet<Domain.Photo> Photos { get; set; }
    public DbSet<Domain.Comment> Comments { get; set; }

    public DbSet<Domain.UserFollowing> Followings { get; set; }


    //adding data to database when migration is created
    protected override void OnModelCreating(ModelBuilder builder)
    {
      //gives AppUser primary key of string during migration
      base.OnModelCreating(builder); //added with identity

      //could add individual elements if desired
      // builder.Entity<Domain.Activity>().HasData(
      //   new Domain.Activity { ... },
      // );

      //configure UserActivity

      //define primary key (here composite key)
      builder.Entity<Domain.UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));
      //define first half of relationship - one user can have many activities
      builder.Entity<Domain.UserActivity>()
        .HasOne(u => u.AppUser)
        .WithMany(ua => ua.UserActivities)
        .HasForeignKey(u => u.AppUserId);
      //define second half of relationship - one activity can have many users
      builder.Entity<Domain.UserActivity>()
        .HasOne(a => a.Activity)
        .WithMany(ua => ua.UserActivities)
        .HasForeignKey(a => a.ActivityId);

      //define follower/following relationship
      builder.Entity<Domain.UserFollowing>(b =>
      {
        //combination key
        b.HasKey(k => new { k.ObserverId, k.TargetId });

        b.HasOne(o => o.Observer)
          .WithMany(f => f.Followings)
          .HasForeignKey(o => o.ObserverId)
          .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(t => t.Target)
          .WithMany(f => f.Followers)
          .HasForeignKey(t => t.TargetId)
          .OnDelete(DeleteBehavior.Restrict);
      });
    }
  }
}
