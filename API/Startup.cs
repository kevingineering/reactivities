using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder; //IApplicationBuilder, UseDeveloperExceptionPage, UseRouting, useAuthorization, UseEndpoints
using Microsoft.AspNetCore.Hosting; //IWebHostEnvironment
using Microsoft.EntityFrameworkCore;  //UseSQLite
using Microsoft.Extensions.Configuration; //GetConnectionString, IConfiguration
using Microsoft.Extensions.DependencyInjection; //IServiceCollection, AddDbContext, AddControlers
using Microsoft.Extensions.Hosting; //env

namespace API
{
  public class Startup
  {
    //constructor - injects configuration
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    //represents key/value pair 
    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. 
    //dependency injection container
    public void ConfigureServices(IServiceCollection services)
    {
      //UseSqlite takes connection string from configuration files
      services.AddDbContext<Persistence.DataContext>(opt =>
      {
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });

      //add CORS headers - allow anything from localhost
      services.AddCors(opt => 
      {
        opt.AddPolicy("CorsPolicy", policy=>
        {
          policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
        });
      });

      //add mediatr - takes assembly, have to tell it about at least one class in assembly
      services.AddMediatR(typeof(Application.Activities.List.Handler).Assembly);

      //adding controllers - previously AddMvc
      services.AddControllers()
        .AddFluentValidation(cfg => {
          //we give it Create class, but it registers all methods in that folder
          cfg.RegisterValidatorsFromAssemblyContaining<Application.Activities.Create>();
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    //can add middleware - order is important
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      //use custom error handling middleware
      app.UseMiddleware<API.Middleware.ErrorHandlingMiddleware>();

      //if in development mode, provide detailed information in case of error - otherwise return only error code
      if (env.IsDevelopment())
      {
        // app.UseDeveloperExceptionPage();
      }

      //requests coming in on HTTP are redirected to HTTPS
      // app.UseHttpsRedirection();

      //controls routing
      app.UseRouting();

      //for authentication
      app.UseAuthorization();

      //add CORS
      app.UseCors("CorsPolicy");

      //maps controller endpoints into API
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
