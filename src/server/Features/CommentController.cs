using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using CommentSection.src.server.Models;
using Microsoft.Extensions.Configuration;

namespace CommentSection.src.server.Features
{
    [Route("[controller]/[action]")]
    public class CommentController : Controller
    {
        private readonly IConfiguration config;

        public CommentController(IConfiguration config)
        {
            this.config = config;
        }

        [HttpGet]
        [Route("{id:int}/{pid:int}/{cnum:int}")]
        public List<Comment> GetChildren(string id, string pid, string cnum)
        {
            string sql = (-1 == int.Parse(id))
                ? "SELECT * FROM Comments " +
                  "WHERE parent_id IS NULL AND prompt_id = @pid AND chatbox_num = @cnum;"

                : "SELECT * FROM Comments " +
                    "WHERE parent_id = @id;"
            ;

            using (SqlConnection connection = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main")))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    command.Parameters.AddWithValue("@pid", pid);
                    command.Parameters.AddWithValue("@cnum", cnum);
                              
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        List<Comment> result = new List<Comment>();
                        DataTable dt = new DataTable();
                        dt.Load(reader);
                        foreach (DataRow row in dt.Rows)
                        {
                            result.Add(Comment.RowToComment(row));
                        }
                        return result;
                    }
                }
            }
            
        }



    }

}

