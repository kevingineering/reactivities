using Microsoft.AspNetCore.Builder; //UseDeveloperExceptionPage, UseRouting, useAuthorization, UseEndpoints
using Microsoft.AspNetCore.Hosting; //IWebHostEnvironment
using Microsoft.EntityFrameworkCore;  //UseSQLite
using Microsoft.Extensions.Configuration; //GetConnectionString
using Microsoft.Extensions.DependencyInjection; //IServiceCollection, AddDbContext, AddControlers
using Microsoft.Extensions.Hosting;

namespace API
{
  public class Startup
  {
    //constructor - injects configuration - allows us to access various configuration settings
    public Startup(Microsoft.Extensions.Configuration.IConfiguration configuration)
    {
      Configuration = configuration;
    }

    //represents key/value pair 
    public Microsoft.Extensions.Configuration.IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container (dependency injection)
    public void ConfigureServices(Microsoft.Extensions.DependencyInjection.IServiceCollection services)
    {
      //UseSqlite takes connection string from configuration files
      services.AddDbContext<Persistence.DataContext>(opt =>
      {
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });
      //adding controllers - previously AddMvc
      services.AddControllers();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    //can add middleware - order is important
    public void Configure(Microsoft.AspNetCore.Builder.IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
    {
      //if in development mode, provide detailed information in case of error
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      //requests coming in on HTTP are redirected to HTTPS
      // app.UseHttpsRedirection();

      //controls routing
      app.UseRouting();

      //for authentication
      app.UseAuthorization();

      //maps controller endpoints into API
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
