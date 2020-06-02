using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Comments
{
  public class Create
  {
    public class Command : IRequest<CommentDTO>
    {
      public string Body { get; set; }
      public Guid ActivityId { get; set; }
      public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Command, CommentDTO>
    {
      private readonly Persistence.DataContext _context;
      private readonly IMapper _mapper;

      public Handler(Persistence.DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<CommentDTO> Handle(Command request, CancellationToken cancellationToken)
      {
        //get activity
        var activity = await _context.Activities.FindAsync(request.ActivityId);

        if (activity == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { activity = "Activity not found." });
        }

        //get user
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

        if (user == null)
        {
          throw new Application.Errors.RestException(HttpStatusCode.NotFound, new { user = "User not found." });
        }

        //create comment
        var comment = new Domain.Comment
        {
          Author = user,
          Body = request.Body,
          CreatedAt = DateTime.Now,
          Activity = activity
        };

        //add comment to DB
        activity.Comments.Add(comment);

        var success = await _context.SaveChangesAsync() > 0;

        //map and return DTO
        if (success) return _mapper.Map<Domain.Comment, CommentDTO>(comment);

        throw new Exception("Problem saving changes.");
      }
    }
  }
}