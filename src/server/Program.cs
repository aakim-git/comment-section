using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CommentSection
{
    public class Program
    {
        // Application Main Entry
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) {
            var config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddJsonFile("Properties/appsettings.json")
                .AddJsonFile("Properties/launchSettings.json")
                .Build();

            return Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(
                webBuilder => {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseConfiguration(config);
                }
            );
        }
    }
}
