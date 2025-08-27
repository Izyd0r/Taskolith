using System.Net.Http.Json;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;

namespace Taskolith.API.IntegrationTests;

public class AuthorizedIntegrationTest : BaseIntegrationTest
{
    public required User AuthorizedUser { get; init; }
    public required HttpClient AuthorizedHttpClient { get; init; }

    protected AuthorizedIntegrationTest(IntegrationTestWebAppFactory factory) : base(factory) { }

    public static async Task<AuthorizedIntegrationTest> BuildAuthorizedTest(IntegrationTestWebAppFactory factory)
    {
        var clientOptions = new WebApplicationFactoryClientOptions
        {
            HandleCookies = true,
            BaseAddress = new Uri("https://localhost")
        };
        var client = factory.CreateClient(clientOptions);
        var user = GenerateFakeUser();
        PasswordHasher<User> passwordHasher = new();
        string passwordRequest = user.Password;
        user.Password = passwordHasher.HashPassword(user, user.Password);
        
        using (var scope = factory.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
        }

        var loginRequest = new LoginRequest(user.Username, passwordRequest);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        response.EnsureSuccessStatusCode();

        return new AuthorizedIntegrationTest(factory)
        {
            AuthorizedHttpClient = client,
            AuthorizedUser = user
        };
    }

    private static User GenerateFakeUser()
    {
        return new Faker<User>()
            .RuleFor(u => u.Username, f => f.Internet.UserName(f.Name.FirstName(), f.Name.LastName()))
            .RuleFor(u => u.Password, "Password123!")
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .Generate();
    }
}