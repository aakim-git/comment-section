using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CommentSection.src.server.Features
{
    [Route("[controller]/[action]")]
    public class PromptController
    {
        public string Create()
        {
            return "Hello, World!";
        }

    }
}