using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
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
        var client = _factory.CreateClient(); 
        var user = new User {
            Username = "testusername",
            Email = "example@email.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        PasswordHasher<User> passwordHasher = new();
        user.Password = passwordHasher.HashPassword(user, "PasswordExample123!");
        
        var loginRequest = new LoginRequest(user.Username, "PasswordExample123!");
        
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();
        
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseContent = await response.Content.ReadAsStringAsync();
    
        response.StatusCode.Should().Be(HttpStatusCode.OK, $"response content: {responseContent}");
        
        var setCookieHeader = response.Headers.GetValues("Set-Cookie");
        setCookieHeader.Should().NotBeNullOrEmpty();
        setCookieHeader.Should().Contain(c => c.StartsWith("access_token="));
        setCookieHeader.Should().Contain(c => c.Contains("httponly"));
        setCookieHeader.Should().Contain(c => c.Contains("samesite=lax"));

        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
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