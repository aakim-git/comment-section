using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CommentSection.src.server.Models
{
    public class Prompt
    {
        public int id { get; set; }
        public string body { get; set; }
        public int num_chatboxes { get; set; }

        public static Prompt ReaderToPrompt(SqlDataReader reader)
        {
            Prompt result = new Prompt
            {
                body = reader.GetString(0),
                id = reader.GetInt32(1),
                num_chatboxes = reader.GetInt32(2),
            };

            return result;
        }
    }
}
