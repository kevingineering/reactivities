using System; //Exception
using Microsoft.AspNetCore.Hosting; //UseStartup
using Microsoft.AspNetCore.Identity; //UserManager
using Microsoft.EntityFrameworkCore; //Migrate
using Microsoft.Extensions.DependencyInjection; //CreateScope
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging; //ILogger, LogError

namespace API
{
  public class Program
  {
    //Main is where program begins
    //args (if they exist) are from command line
    //this method initializes the host and runs the application
    public static void Main(string[] args)
    {
      var host = CreateHostBuilder(args).Build();

      //database
      using (var scope = host.Services.CreateScope())
      {
        //reference to services
        var services = scope.ServiceProvider;
        //try to get database context and migrate database
        try
        {
          var context = services.GetRequiredService<Persistence.DataContext>();
          
          //for identity
          var userManager = services.GetRequiredService<UserManager<Domain.AppUser>>();

          //applies pending migrations for the context to the database
          //will create database if it does not exist
          context.Database.Migrate();

          //seed data if no activities in database - added userManager for identity
          //wait function works like await
          Persistence.Seed.SeedData(context, userManager).Wait();
        }
        catch (Exception ex)
        {
          //log error if one occurs
          var logger = services.GetRequiredService<ILogger<Program>>();
          logger.LogError(ex, "An error occured during migration.");
        }
      }

      //runs application
      host.Run();
    }

    //CreateDefaultBuilder() - sets current directory as API.Startup class, loads configuration for project from appsettings.json, appsettings.<env>.json, and user secrets, and configures logging
    //configureWebHostDefaults() - configures app for Kestrel web server
    public static IHostBuilder CreateHostBuilder(string[] args)
    {
      return Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(webBuilder =>
        {
          webBuilder.UseStartup<API.Startup>();
        });
    }
  }
}
