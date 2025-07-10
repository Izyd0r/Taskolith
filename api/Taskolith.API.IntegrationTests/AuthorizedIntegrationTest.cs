using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;

namespace Taskolith.API.IntegrationTests;

public class AuthorizedIntegrationTest : BaseIntegrationTest {
    public required User AuthorizedUser { get; init; }
    public required HttpClient AuthorizedHttpClient { get; init; }
    
    protected AuthorizedIntegrationTest(IntegrationTestWebAppFactory factory) : base(factory) { }

    protected static async Task<AuthorizedIntegrationTest> BuildAuthorizedTest(IntegrationTestWebAppFactory factory) {
        var client = factory.CreateClient();
       
        var userFaker = new Faker<User>()
            .RuleFor(u => u.Username, f => f.Random.String2(8, 20, "abcdefghijklmnopqrstuvwxyz0123456789"))
            .RuleFor(u => u.Password, f => f.Internet.Password(12, false, "\\w", "Example123!")) // creates something like 'Example123!abc'
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName());
        var user = userFaker.Generate(); 
        
        var test = new AuthorizedIntegrationTest(factory) {
            AuthorizedUser = user,
            AuthorizedHttpClient = client
        };
        
        test.DbContext.Users.Add(user);
        await test.DbContext.SaveChangesAsync();

        var loginRequest = new LoginRequest(user.Username, user.Password);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        response.EnsureSuccessStatusCode();

        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginResponse?.Token);

        return new AuthorizedIntegrationTest(factory) {
            AuthorizedHttpClient = client,
            AuthorizedUser = user
        };
    }
}