using System.Net.Http.Headers;
using System.Net.Http.Json;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;

namespace Taskolith.API.IntegrationTests;

public class AuthorizedIntegrationTest : BaseIntegrationTest {
    public required User AuthorizedUser { get; init; }
    public required HttpClient AuthorizedHttpClient { get; init; }
    
    protected AuthorizedIntegrationTest(IntegrationTestWebAppFactory factory) : base(factory) { }

    protected static async Task<AuthorizedIntegrationTest> BuildAuthorizedTest(IntegrationTestWebAppFactory factory) {
        var client = factory.CreateClient();
        
        var user = new User {
            Username = "testusername2",
            Password = "PasswordExample123!",
            Email = "example@email2.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        
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