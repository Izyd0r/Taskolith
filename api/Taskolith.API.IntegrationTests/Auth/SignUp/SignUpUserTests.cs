using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth.SignUp;

namespace Taskolith.API.IntegrationTests.Auth.SignUp;

public class SignUpUserTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task RegisterUser_WithValidInput_ShouldCreateUserAndSetAuthCookies()
    {
        // Arrange
        var client = _factory.CreateClient();
        var payload = new SignUpRequestFaker().Generate(); 

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", payload);

        var responseContent = await response.Content.ReadAsStringAsync();
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created, $"response content: {responseContent}");

        // 1. Verify the database state
        var userInDb = await DbContext.Users.FirstOrDefaultAsync(u => u.Username == payload.Username);
        userInDb.Should().NotBeNull();
        userInDb.Email.Should().Be(payload.Email);
        // Note: You should be asserting against a hashed password, not the plain text one.
        // userInDb.Password.Should().NotBe(payload.Password); 

        // 2. Verify response headers and cookies
        var signUpResponse = await response.Content.ReadFromJsonAsync<SignUpResponse>(); // This might contain the new user's ID
        response.Headers.Location!.ToString()
            .Should().Be($"/api/users/{signUpResponse.Id}");

        var setCookieHeader = response.Headers.GetValues("Set-Cookie");
        setCookieHeader.Should().NotBeNullOrEmpty();
        setCookieHeader.Should().Contain(c => c.StartsWith("access_token="));
        setCookieHeader.Should().Contain(c => c.StartsWith("refresh_token="));
        setCookieHeader.Should().Contain(c => c.Contains("httponly"));
    }
    
    [Theory]
    [InlineData("plainaddress")]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("user@domain..com")]
    [InlineData("user@ domain.com")]
    [InlineData("user<>@domain.com")]
    public async Task RegisterUser_WithInvalidEmail_ShouldReturnBadRequest(string? invalidEmail)
    {
        // Arrange
        var client = _factory.CreateClient();
        var payload = new SignUpRequestFaker()
            .RuleFor(r => r.Email, invalidEmail)
            .Generate();
        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", payload);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        // Assert
        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        problemDetails.Should().NotBeNull();
        
        
        var userExits = await DbContext.Users
            .AnyAsync(u => u.Email == invalidEmail);
        userExits.Should().BeFalse();
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData(" ")]
    [InlineData("\t")]
    [InlineData("\n")]
    [InlineData("\r")]
    [InlineData("\r\n")]
    [InlineData("pass")]
    [InlineData("passwD")]
    [InlineData("passwD1")]
    public async Task RegisterUser_WithInvalidPassword_ShouldReturnBadRequest(string? invalidPassword)
    {
        // Arrange
        var client = _factory.CreateClient();
        var payload = new SignUpRequestFaker()
            .RuleFor(r => r.Password, invalidPassword)
            .Generate();
        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", payload);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        // Assert
        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        problemDetails.Should().NotBeNull();
        
        var userExits = await DbContext.Users
            .AnyAsync(u => u.Password == invalidPassword);
        userExits.Should().BeFalse();
    }
    
    [Fact]
    public async Task RegisterUser_WithTakenEmail_ShouldReturnBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var payload = new SignUpRequestFaker().Generate();
        // Act
        var firstResponse = await client.PostAsJsonAsync("/api/auth/register", payload);
        firstResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var secondResponse = await client.PostAsJsonAsync("/api/auth/register", payload);
        secondResponse.StatusCode.Should().Be(HttpStatusCode.Conflict);
        // Assert
        var userExits = await DbContext.Users
            .CountAsync(u => u.Email == payload.Email);
        userExits.Should().Be(1);
    }
    
    [Fact]
    public async Task RegisterUser_WithTakenUsername_ShouldReturnBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var payload = new SignUpRequestFaker().Generate();
        // Act
        var firstResponse = await client.PostAsJsonAsync("/api/auth/register", payload);
        firstResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var secondResponse = await client.PostAsJsonAsync("/api/auth/register", payload);
        secondResponse.StatusCode.Should().Be(HttpStatusCode.Conflict);
        // Assert
        var userExits = await DbContext.Users
            .CountAsync(u => u.Username == payload.Username);
        userExits.Should().Be(1);
    }
}