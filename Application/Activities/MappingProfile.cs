using System.Linq;
using AutoMapper; //Profile

namespace Application.Activities
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      //source => target

      CreateMap<Domain.Activity, ActivityDTO>();
    
      CreateMap<Domain.UserActivity, AttendeeDTO>()
      //configuring return so automapper knows which properties to map - initially were coming back null
        .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
        .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
        .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
        .ForMember(d => d.isFollowing, o => o.MapFrom<FollowingResolver>());
    }
  }
}