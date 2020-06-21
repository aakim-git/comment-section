using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using CommentSection.src.server.Models;

namespace CommentSection.src.server.Features
{
    [Route("[controller]/[action]")]
    public class PromptController : Controller
    {
        private readonly IConfiguration config;

        public PromptController(IConfiguration config)
        {
            this.config = config;
        }

        [HttpPost]
        public Prompt Create([FromBody] Prompt newPrompt)
        {
            string sql =
                "INSERT into Prompts (body, num_chatboxes) " +
                "OUTPUT inserted.body, inserted.id, inserted.num_chatboxes " +
                "VALUES(@NewBody, @NumChatboxes); "
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@NewBody", newPrompt.body);
                    command.Parameters.AddWithValue("@NumChatboxes", newPrompt.num_chatboxes);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return Prompt.ReaderToPrompt(reader);
                        }
                    }
                }
            }

            return null;

        }


        [HttpGet]
        [Route("{id:int}")]
        public Prompt Get(int id)
        {
            string sql =
                "SELECT * FROM Prompts " +
                "WHERE id = @id ";
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@id", id);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return Prompt.ReaderToPrompt(reader);
                        }
                    }
                }
            }

            return null;

        }
    }
}