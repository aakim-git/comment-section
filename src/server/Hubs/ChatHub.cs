using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System;
using CommentSection.src.server;
using Microsoft.Extensions.Configuration;
using System.Runtime.InteropServices.ComTypes;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using CommentSection.src.server.Models;

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

        public Task SendComment(string user, string comment, string group_id, long replying_to)
        {
            // group_id is always passed in the form [prompt_id/chatbox_id]
            var id = group_id.Split("/");

            // save comment in database. 
            string sql_save_comment =
                "INSERT into Comments (body, author, prompt_id, chatbox_num, parent_id) " +
                "OUTPUT inserted.* " +
                "VALUES(@body, @author, @prompt_id, @chatbox_num, @replying_to); "
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(sql_save_comment, connection))
                {
                    command.Parameters.AddWithValue("@body", comment);
                    command.Parameters.AddWithValue("@author", user);
                    command.Parameters.AddWithValue("@prompt_id", id[0]);
                    command.Parameters.AddWithValue("@chatbox_num", id[1]);
                    if (replying_to == 0)
                        command.Parameters.AddWithValue("@replying_to", DBNull.Value);
                    else
                    {
                        command.Parameters.AddWithValue("@replying_to", replying_to);

                        // if the comment is a reply, then we increment num_replies of parent comment            
                        string sql_increment_num_replies =
                            "UPDATE Comments " +
                            "SET num_replies = num_replies + 1 " +
                            "WHERE id = @replying_to;"
                        ;

                        using (SqlCommand inc = new SqlCommand(sql_increment_num_replies, connection))
                        {
                            inc.Parameters.AddWithValue("@replying_to", replying_to);
                            inc.ExecuteNonQuery();
                        }
                    }

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        // returns the sent comment
                        while (reader.Read())
                        {
                            return Clients.Group(group_id).SendAsync("ReceiveComment", Comment.ReaderToComment(reader));
                        }
                    }
                }
            }

            return null;

        }
    }
}