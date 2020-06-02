using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace CommentSection.src.server.Features
{
    [Route("[controller]/[action]")]
    public class PromptController : Controller
    {
        [HttpPost]
        public string Create([FromBody] Models.Prompt newPrompt)
        {
            string sql = "INSERT into Prompts (body) Values (@NewBody)";
            using (SqlCommand command = new SqlCommand(sql, DBConnection.db))
            {
                command.Parameters.AddWithValue("@NewBody", newPrompt.body);
                command.ExecuteNonQuery();
            }
            return newPrompt.body;
        }

    }
}