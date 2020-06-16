using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;

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
        public List<string> Create([FromBody] Models.Prompt newPrompt)
        {
            string sql =
                "INSERT into Prompts (body) " +
                "OUTPUT inserted.id, inserted.body " +
                "VALUES(@NewBody); "
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@NewBody", newPrompt.body);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        List<string> result = new List<string>();
                        while (reader.Read())
                        {
                            result.Add(reader.GetInt32(0).ToString());
                            result.Add(reader.GetString(1));
                        }

                        return result;

                    }
                }
            }

        }


        [HttpGet]
        [Route("{id:int}")]
        public string Get(string id)
        {
            string sql =
                "SELECT body FROM Prompts " +
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
                            return reader.GetString(0);
                        }
                    }
                }
            }

            return "";

        }
    }
}