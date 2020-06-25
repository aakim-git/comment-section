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
                .AddJsonFile("src/server/Properties/appsettings.json")
                .AddJsonFile("src/server/Properties/launchSettings.json")
                .AddEnvironmentVariables()
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
