using Microsoft.Extensions.DependencyInjection;
using Taskolith.API.Data;

namespace Taskolith.API.IntegrationTests;

public abstract class BaseIntegrationTest(IntegrationTestWebAppFactory factory)
   : IClassFixture<IntegrationTestWebAppFactory>
{
   private readonly IServiceScope _scope = factory.Services.CreateScope();
   protected AppDbContext DbContext => _scope.ServiceProvider.GetRequiredService<AppDbContext>();
}