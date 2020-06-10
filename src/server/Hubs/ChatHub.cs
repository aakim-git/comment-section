using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System;

namespace CommentSection.Hubs
{

    public class ChatHub : Hub
    {
        public Task JoinGroup(string id)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, id);
        }

        public Task SendMessage(string user, string message, string group_id)
        {
            // send message to database. 

            // send data to clients. 
            return Clients.Group(group_id).SendAsync("ReceiveMessage", user, message);
        }
    }
}