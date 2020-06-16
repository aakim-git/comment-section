using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CommentSection.src.server.Models
{
    public class Comment
    {
        public string body { get; set; }
        public DateTime date { get; set; }
        public int rank { get; set; }
        public string author { get; set; }
        public int? parent_id { get; set; }
        public int num_replies { get; set; }
        public int prompt_id { get; set; }
        public int chatbox_num { get; set; }
    }
}