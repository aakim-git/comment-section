using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CommentSection.src.server.Models
{
    public class Comment
    {
        public long id { get; set; }
        public string body { get; set; }
        public DateTime date { get; set; }
        public int rank { get; set; }
        public string author { get; set; }
        public long? parent_id { get; set; }
        public int num_replies { get; set; }
        public int prompt_id { get; set; }
        public int chatbox_num { get; set; }

        public static Comment RowToComment(DataRow row)
        {
            Comment result = new Comment
            {
                id = row.Field<long>("id"),
                body = row.Field<string>("body"),
                date = row.Field<DateTime>("date"),
                rank = row.Field<int>("rank"),
                author = row.Field<string>("author"),
                parent_id = row.Field<long?>("parent_id"),
                num_replies = row.Field<int>("num_replies"),
                prompt_id = row.Field<int>("prompt_id"),
                chatbox_num = row.Field<int>("chatbox_num")
            };
            return result;
        }

        public static Comment ReaderToComment(SqlDataReader reader)
        {
            Comment result = new Comment
            {
                id = reader.GetInt64(0),
                body = reader.GetString(1),
                date = reader.GetDateTime(2),
                rank = reader.GetInt32(3),
                author = reader.GetString(4),
                parent_id = reader["parent_id"] as long? ?? default(long),
                num_replies = reader.GetInt32(6),
                prompt_id = reader.GetInt32(7),
                chatbox_num = reader.GetInt32(8)
            };
            return result;
        }

    }


    
}