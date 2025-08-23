using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Auth.Login;

public class LoginUserTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : BaseIntegrationTest(factory)
{
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;
    private readonly IntegrationTestWebAppFactory _factory = factory;
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();
    
    [Fact]
    public async Task LoginUser_ThatExists_ShouldReturnSuccessAndSetAuthCookie()
    {
        // Arrange
        // The factory client is configured to handle cookies automatically.
        var client = _factory.CreateClient(); 
        var user = new User {
            Username = "testusername",
            Password = "PasswordExample123!",
            Email = "example@email.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        var loginRequest = new LoginRequest(user.Username, user.Password);
        
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();
        
        // Act: Log the user in
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseContent = await response.Content.ReadAsStringAsync();
    
        // Assert: Check for a successful response and the presence of cookies
        response.StatusCode.Should().Be(HttpStatusCode.OK, $"response content: {responseContent}");
        
        // 1. Verify the authentication cookies were set
        var setCookieHeader = response.Headers.GetValues("Set-Cookie");
        setCookieHeader.Should().NotBeNullOrEmpty();
        setCookieHeader.Should().Contain(c => c.StartsWith("access_token=")); // Or whatever you name your access token cookie
        setCookieHeader.Should().Contain(c => c.Contains("httponly"));
        setCookieHeader.Should().Contain(c => c.Contains("samesite=strict")); // Or Lax, depending on your setup
    
        // The response body might now contain user info without tokens
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>(); // Assuming you return some user data
        loginResponse.Should().NotBeNull();
        loginResponse.Username.Should().BeEquivalentTo(user.Username);
    }
    
    [Theory]
    [InlineData("nonexistent@email.com", "CorrectPassword123!")]
    [InlineData("existinguser@email.com", "WrongPassword123!")]
    [InlineData("not-an-email", "SomePassword123!")]
    public async Task LoginUser_ThatDontExist_ShouldReturnUnauthorized(string email, string password)
    {
        // Arrange
        var invalidLoginRequest = new LoginRequest
        (
            email,
            password
        );
        var client = _factory.CreateClient();
        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", invalidLoginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
    
    [Theory]
    [InlineData("", "ValidPassword123!")]
    [InlineData("user@example.com", "")]
    [InlineData("", "")]
    public async Task Login_InvalidInput_ShouldReturnBadRequest(string email, string password)
    {
        var request = new LoginRequest ( email,password );
        var client = _factory.CreateClient();
        
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("' OR 1=1 --", "SomePassword123!")]
    [InlineData("existinguser@email.com", "' OR '1'='1")]
    public async Task LoginUser_ThatTriesSQLInject_ShouldReturnUnauthorized(string email, string password)
    {
        var request = new LoginRequest ( email,password );
        var client = _factory.CreateClient();
        
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized); 
    }
}