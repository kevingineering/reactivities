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
using Microsoft.IdentityModel.Tokens; //TokenValidationParameters
using AutoMapper;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Configuration.UserSecrets;

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

    //ConfigureServices is a dependency injection container called by the runtime.
    //Environment specific versions (e.g. ConfigureDevelopmentServices) will be called if they exist, but ConfigureServices is the fall back.
    //https://docs.microsoft.com/en-us/aspnet/core/fundamentals/environments?view=aspnetcore-3.1

    //Configure is used to configure the HTTP request pipeline (middleware - order is important!). It is called by the runtime.
    //Environments specific versions are available here as with ConfigureServices.

    public void ConfigureDevelopmentServices(IServiceCollection services)
    {
      //UseSqlite takes connection string from configuration files
      services.AddDbContext<Persistence.DataContext>(opt =>
      {
        opt.UseLazyLoadingProxies();
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });

      ConfigureServices(services);
    }

    public void ConfigureProductionServices(IServiceCollection services)
    {
      services.AddDbContext<Persistence.DataContext>(opt =>
      {
        opt.UseLazyLoadingProxies();
        opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
      });

      ConfigureServices(services);
    }

    public void ConfigureServices(IServiceCollection services)
    {
      //AddTransient - always different, a new instance is provided to every controller and every service
      //AddScoped - same within a request, but different across different requests
      //AddSingleton - same for every object and every request

      //add CORS headers - allow anything from localhost
      services.AddCors(opt =>
      {
        opt.AddPolicy("CorsPolicy", policy =>
        {
          policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("WWW-Authenticate") //necessary to determine if token has expired
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
        });
      });

      //add mediatr - takes assembly, have to tell it about at least one class in assembly
      services.AddMediatR(typeof(Application.Activities.List.Handler).Assembly);

      //tell assembly to go and look for mapping profiles 
      services.AddAutoMapper(typeof(Application.Activities.List.Handler));

      services.AddSignalR();

      //adding controllers - previously AddMvc - AddController removes functionality we do not need (e.g. razor views)
      //Authorization policy means everything requires authorization unless marked otherwise
      services.AddControllers(opt =>
      {
        //if user is authenticated, they are also authorized - create roles in future?
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

      //adds authorization policy to check if user is host of activity
      services.AddAuthorization(opt =>
      {
        opt.AddPolicy("IsActivityHost", policy =>
        {
          policy.Requirements.Add(new Infrastructure.Security.IsHostRequirement());
        });
      });

      //
      services.AddTransient<IAuthorizationHandler, Infrastructure.Security.IsHostRequirementHandler>();

      //key here same as in JwtGenerator
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opt =>
        {
          //tell API what to validate when receiving token
          opt.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuerSigningKey = true, //check signing key first to make sure token originated here
            IssuerSigningKey = key, //key used to create token
            ValidateAudience = false, //could be url it comes from 
            ValidateIssuer = false, //would be local host or servicer
            ValidateLifetime = true, //checks token expiry date - has ~5 minute leeway
            ClockSkew = TimeSpan.Zero //eliminate ValidateLifetime's leeway
          };
          //add token to SignalR Hub context - https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-3.1
          opt.Events = new JwtBearerEvents
          {
            OnMessageReceived = context =>
            {
              //get token from context
              var accessToken = context.Request.Query["access_token"];

              //get path
              var path = context.HttpContext.Request.Path;

              //if token exists and path matches our endpoint
              if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
              {
                context.Token = accessToken;
              }

              return Task.CompletedTask;
            }
          };
        });

      //custom services
      services.AddScoped<Application.Interfaces.IJwtGenerator, Infrastructure.Security.JwtGenerator>();
      services.AddScoped<Application.Interfaces.IUserAccessor, Infrastructure.Security.UserAccessor>();
      services.AddScoped<Application.Interfaces.IPhotoAccessor, Infrastructure.Photos.PhotoAccessor>();
      services.AddScoped<Application.Profiles.IProfileReader, Application.Profiles.ProfileReader>();
      services.AddScoped<Application.Interfaces.IFacebookAccessor, Infrastructure.Security.FacebookAccessor>();

      //configuration has access to dotnet user secrets, settings are strongly typed to the values contained in user secrets
      services.Configure<Infrastructure.Photos.CloudinarySettings>(Configuration.GetSection("Cloudinary"));
      services.Configure<Infrastructure.Security.FacebookAppSettings>(Configuration.GetSection("Facebook"));
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      //use custom error handling middleware
      app.UseMiddleware<API.Middleware.ErrorHandlingMiddleware>();

      //if in development mode, provide detailed information in case of error
      // if (env.IsDevelopment())
      // {
      //   app.UseDeveloperExceptionPage();
      // }

      //add middleware to add security headers
      app.UseXContentTypeOptions(); //prevents content sniffing
      app.UseReferrerPolicy(opt => opt.NoReferrer()); //restricts amount of info sent to other sites when refering to other sites
      app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); //stop loading page when cross site scripting attack is identified - cross site scripting attacks occur when people add code inside your web page
      app.UseXfo(opt => opt.Deny()); //blocks Iframes and prevents clickjacking attacks - clickjacking occurs when a malicious user/website places an iframe over your site so other users intend to click on your content but click on something else instead
      //app.UseCspReportOnly - get list of things wrong with site
      app.UseCsp(opt => opt
        .BlockAllMixedContent() //prevents loading any assets using Http when page is loaded using Https
                                //set sources below - external (such as google), self, hash identifiers (has comes from report), and blob: or data:
        .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "sha256-F4GpCPyRepgP5znjMD8sc7PEjzet5Eef4r09dEGPpTs="))
        .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
        .FormActions(s => s.Self())
        .FrameAncestors(s => s.Self())
        .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "blob:", "data:"))
        .ScriptSources(s => s.Self().CustomSources("sha256-eE1k/Cs1U0Li9/ihPPQ7jKIGDvR8fYw65VJw+txfifw="))
      );

      //requests coming in on HTTP are redirected to HTTPS
      // app.UseHttpsRedirection();

      //static files go here
      app.UseDefaultFiles();
      app.UseStaticFiles();

      //controls routing - adds route matching to the pipeline
      app.UseRouting();

      //add CORS
      app.UseCors("CorsPolicy");

      //determining identity of user
      app.UseAuthentication();

      //determining if identified user has access
      app.UseAuthorization();

      //adds endpoint execution - controllers and signalR
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        endpoints.MapHub<SignalR.ChatHub>("/chat");
        endpoints.MapFallbackToController("Index", "Fallback");
      });
    }
  }
}
