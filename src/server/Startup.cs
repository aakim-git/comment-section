using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using CommentSection.Hubs;
using System.Data.SqlClient;
using System.IO;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Options;

namespace CommentSection
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;
            src.server.DBConnection.Init(config); // instantiates global dbconnection
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();
            services.AddMvc(option => option.EnableEndpointRouting = false) ; 
            services.AddSpaStaticFiles(Configuration =>
            {
                Configuration.RootPath = "../src/client/comment-section-client";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }

            else {
                app.UseExceptionHandler("/Error");
                app.UseHsts(); // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization(); 
            app.UseEndpoints(endpoints => {
                endpoints.MapHub<ChatHub>("/Hubs/chatHub"); 
            });
            app.UseMvc();
            
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = Path.Join(env.ContentRootPath, "/src/client/comment-section-client");
                spa.UseReactDevelopmentServer(npmScript: "start");
            });
        }
    }
}