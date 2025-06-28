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
    public async Task RegisterUser_WithValidInput_WriteUserToDatabase()
    {
        // Arrange
        var client = _factory.CreateClient();

        var payload = new SignUpRequestFaker().Generate(); 

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", payload);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var registerResponse = await response.Content.ReadFromJsonAsync<SignUpResponse>();
        registerResponse.Should().NotBeNull();
        registerResponse.Token.Should().NotBeNullOrEmpty();
        registerResponse.RefreshToken.Should().NotBeNullOrEmpty();
        
        var userInDb = await DbContext.Users.FindAsync(registerResponse.Id);

        userInDb.Should().NotBeNull();
        userInDb.Email.Should().Be(payload.Email);
        userInDb.FirstName.Should().Be(payload.FirstName);
        userInDb.LastName.Should().Be(payload.LastName);
        userInDb.Password.Should().Be(payload.Password);
        userInDb.Username.Should().Be(payload.Username);
        response.Headers.Location!.ToString()
            .Should().Be($"/api/users/{registerResponse.Id}");
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