using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System;

namespace CommentSection.Hubs
{
    public class ChatHub : Hub
    {
        SqlConnection db;

        public ChatHub()    
        {
            db = new SqlConnection(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"));
        }
        public async Task SendMessage(string user, string message)
        {
            // send message to database. 
            try {
                db.Open();
                Console.WriteLine("GOOD");
                db.Close();
            } catch {
                Console.WriteLine("BAD");
            }

            // send data to clients. 
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}