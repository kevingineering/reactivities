using System.Linq;
using AutoMapper; //Profile

namespace Application.Comments
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      //source => target

      //must configure UserName, DisplayName, and Image because they are embedded in Author property
      CreateMap<Domain.Comment, CommentDTO>()    
        .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
        .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
        .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
    }
  }
}