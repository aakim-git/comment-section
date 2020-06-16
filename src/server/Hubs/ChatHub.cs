using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System;
using CommentSection.src.server;
using Microsoft.Extensions.Configuration;

namespace CommentSection.Hubs
{

    public class ChatHub : Hub
    {
        private readonly IConfiguration config;

        public ChatHub(IConfiguration config)
        {
            this.config = config;
        }

        public Task JoinGroup(string id)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, id);
        }

        public Task SendMessage(string user, string message, string group_id)
        {
            // save message in database. 
            string sql =
                "INSERT into Comments (body, author, prompt_id, chatbox_num) " +
                "VALUES(@body, @author, @prompt_id, @chatbox_num); "
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    // group_id is always passed in the form [prompt_id/chatbox_id]
                    var meta = group_id.Split("/");

                    command.Parameters.AddWithValue("@body", message);
                    command.Parameters.AddWithValue("@author", user);
                    command.Parameters.AddWithValue("@prompt_id", meta[0]);
                    command.Parameters.AddWithValue("@chatbox_num", meta[1]);
                    command.ExecuteNonQuery();
                }

                // then send data to clients. 
                return Clients.Group(group_id).SendAsync("ReceiveMessage", user, message);
            }
        }
    }
}