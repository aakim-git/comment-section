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

        public Task SendComment(string user, string comment, string group_id)
        {
            // save comment in database. 
            string sql =
                "INSERT into Comments (body, author, prompt_id, chatbox_num) " +
                "OUTPUT inserted.id, inserted.body, inserted.author, inserted.date " +
                "VALUES(@body, @author, @prompt_id, @chatbox_num); "
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    // group_id is always passed in the form [prompt_id/chatbox_id]
                    var id = group_id.Split("/");

                    command.Parameters.AddWithValue("@body", comment);
                    command.Parameters.AddWithValue("@author", user);
                    command.Parameters.AddWithValue("@prompt_id", id[0]);
                    command.Parameters.AddWithValue("@chatbox_num", id[1]);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return Clients.Group(group_id).SendAsync("ReceiveComment", 
                                reader.GetInt64(0).ToString(), 
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetDateTime(3)
                            );
                        }
                    }
                }
            }

            return null;

        }
    }
}