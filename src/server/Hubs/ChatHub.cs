using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System;

namespace CommentSection.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            // send message to database. 

            // send data to clients. 
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}