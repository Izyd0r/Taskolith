using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Taskolith.API.Data;
using Testcontainers.PostgreSql;

namespace Taskolith.API.IntegrationTests;

public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:latest")
        .WithDatabase("taskolith")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();
    
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            var descriptor = services.SingleOrDefault(s => s.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<AppDbContext>(options =>
            {
                options
                    .UseNpgsql(_dbContainer.GetConnectionString());
            });
        });
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration(configBuilder => {
            var appSettings = configBuilder.Sources.FirstOrDefault(
                source => source is JsonConfigurationSource { Path: "appsettings.json" });
            if (appSettings != null) {
                configBuilder.Sources.Remove(appSettings);
            }
            configBuilder.SetBasePath(AppContext.BaseDirectory);
            configBuilder.AddJsonFile("appsettings.Testing.json", optional: false);
        });
    }

    public Task InitializeAsync()
    {
        return _dbContainer.StartAsync();   
    }

    public new Task DisposeAsync()
    {
        return _dbContainer.StopAsync();
    }
}