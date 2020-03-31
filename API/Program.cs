using Microsoft.AspNetCore.Hosting; //UseStartup
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
        try {
          var context = services.GetRequiredService<Persistence.DataContext>();
          //applies pending migrations for the context to the database
          //will create database if it does not exist
          context.Database.Migrate();
        } catch (System.Exception ex) {
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
    public static Microsoft.Extensions.Hosting.IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<API.Startup>();
            });
  }
}
