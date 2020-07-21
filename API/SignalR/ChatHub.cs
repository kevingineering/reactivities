using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
  [Authorize] //validates expiry of token
  public class ChatHub : Hub
  {
    private readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
      _mediator = mediator;
    }

    private string GetUserName()
    {
      //get userName from token on hub context 
      return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
    }

    public async Task SendComment(Application.Comments.Create.Command command)
    {
      string userName = GetUserName();

      command.UserName = userName;

      var comment = await _mediator.Send(command);

      //send comment to any client connected to group after comment has been added to DB
      await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
    }

    //groupName is activityId
    public async Task AddToGroup(string groupName)
    {
      //add connection string into groupName group
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

      string userName = GetUserName();

      await Clients.Group(groupName).SendAsync("Send", $"{userName} has joined the group.");
    }

    public async Task RemoveFromGroup(string groupName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

      string userName = GetUserName();

      await Clients.Group(groupName).SendAsync("Send", $"{userName} has left the group.");
    }
  }
}