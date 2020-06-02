using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace CommentSection.src.server
{
    public static class DBConnection
    {
        public static SqlConnection db { get; set; }
        public static void Init(IConfiguration config)
        {
            db = new SqlConnection(config.GetValue<string>("ConnectionStrings:Main"));

            // Test connection
            try
            {
                db.Open();
            }
            catch
            {
                Console.WriteLine("Could not connect to database");
            }
        }
    }
}
