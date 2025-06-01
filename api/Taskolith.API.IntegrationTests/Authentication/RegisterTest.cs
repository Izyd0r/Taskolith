using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;

namespace Taskolith.API.IntegrationTests.Authentication;

public class RegisterUserTest : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public RegisterUserTest(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }
    
    [Fact]
    public async Task RegisterUser_WithValidInput_ReturnsSuccess()
    {
        // Arrange
        var client = _factory.CreateClient();
        var payload = new
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "example@email.com",
            Password = "Password!@12"
        };
        // Act
        var response = await client.PostAsJsonAsync("/register", payload);
        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
    }

}
