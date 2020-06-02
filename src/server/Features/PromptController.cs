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
            string sql = $"Insert Into Prompts (body) Values ('{newPrompt.body}')";
            using(SqlCommand command = new SqlCommand(sql, DBConnection.db)){
                command.CommandType = CommandType.Text;
                command.ExecuteNonQuery();
            }
            return newPrompt.body;
        }

    }
}