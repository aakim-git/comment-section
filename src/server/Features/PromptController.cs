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
        [HttpPost]
        public string Create([FromBody] Models.Prompt newPrompt)
        {
            return newPrompt.body;
        }

    }
}