using System.Text;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer; //JwtBearerDefaults
using Microsoft.AspNetCore.Authorization; //AuthorizationPolicyBuilder
using Microsoft.AspNetCore.Builder; //IApplicationBuilder, UseDeveloperExceptionPage, UseRouting, useAuthorization, UseEndpoints
using Microsoft.AspNetCore.Hosting; //IWebHostEnvironment
using Microsoft.AspNetCore.Identity; //IdentityBuilder
using Microsoft.AspNetCore.Mvc.Authorization; //AuthorizeFilter
using Microsoft.EntityFrameworkCore; //UseSQLite
using Microsoft.Extensions.Configuration; //GetConnectionString, IConfiguration
using Microsoft.Extensions.DependencyInjection; //IServiceCollection, AddDbContext, AddControlers
using Microsoft.Extensions.Hosting; //env
using Microsoft.IdentityModel.Tokens; //TokenValidationParameters

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
        opt.AddPolicy("CorsPolicy", policy =>
        {
          policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
        });
      });

      //add mediatr - takes assembly, have to tell it about at least one class in assembly
      services.AddMediatR(typeof(Application.Activities.List.Handler).Assembly);

      //adding controllers - previously AddMvc - AddController removes functionality we do not need (e.g. razor views)
      //Authorization policy means everything requires authorization unless marked otherwise
      services.AddControllers(opt => {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
      }).AddFluentValidation(cfg =>
      {
        //we give it Create class, but it registers all methods in that folder
        cfg.RegisterValidatorsFromAssemblyContaining<Application.Activities.Create>();
      });

      //ASP.NET Identity
      //add IdentityCore and tell it about AppUser
      var builder = services.AddIdentityCore<Domain.AppUser>();
      //create new instance of IdentityBuilder and give it UserType and Services
      var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
      //add entity framework implementation of identity stores 
      identityBuilder.AddEntityFrameworkStores<Persistence.DataContext>();
      //add SignInManger type and AppUser
      identityBuilder.AddSignInManager<SignInManager<Domain.AppUser>>();

      //key here same as in JwtGenerator
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opt => 
        {
          opt.TokenValidationParameters = new TokenValidationParameters
          {
            //tell API what to validate when receiving token
            ValidateIssuerSigningKey = true, //check signing key first to make sure token originated here
            IssuerSigningKey = key, //key used to create token
            ValidateAudience = false, //could be url it comes from 
            ValidateIssuer = false //would be local host or servicer
          };
        });

      //custom services
      services.AddScoped<Application.Interfaces.IJwtGenerator, Infrastructure.Security.JwtGenerator>();
      services.AddScoped<Application.Interfaces.IUserAccessor, Infrastructure.Security.UserAccessor>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    //can add middleware - order is important
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      //use custom error handling middleware
      app.UseMiddleware<API.Middleware.ErrorHandlingMiddleware>();

      //if in development mode, provide detailed information in case of error
      // if (env.IsDevelopment())
      // {
      //   app.UseDeveloperExceptionPage();
      // }

      //requests coming in on HTTP are redirected to HTTPS
      // app.UseHttpsRedirection();

      //static files go here
      // app.UseStaticFiles();

      //controls routing
      app.UseRouting();

      //add CORS
      app.UseCors("CorsPolicy");

      app.UseAuthentication();

      app.UseAuthorization();

      //maps controller endpoints into API so API knows what to do when request comes in and gets routed
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
