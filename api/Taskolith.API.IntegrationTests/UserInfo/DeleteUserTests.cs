using System.Net;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Taskolith.API.Data;

namespace Taskolith.API.IntegrationTests.UserInfo;

public class DeleteUserTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task DeleteUser_Should_ReturnNoContent_WhenUserIsAuthenticated()
    {
        // Arrange
        var testUser = await BuildAuthorizedTest(_factory);

        // Act
        var response = await testUser.AuthorizedHttpClient.DeleteAsync("/api/users/me");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent, 
            "because a successful DELETE request should return 204 No Content.");
        
        // Assert
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        var userInDb = await dbContext.Users.FindAsync(testUser.AuthorizedUser.Id);
        
        userInDb.Should().BeNull("because the user should have been deleted from the database.");
    }

    [Fact]
    public async Task DeleteUser_Should_ReturnUnauthorized_WhenTokenIsMissing()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.DeleteAsync("/api/users/me");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
    
    [Fact]
    public async Task DeleteUser_Should_ReturnNotFound_WhenUserDoesNotExistInDb()
    {
        // Arrange
        var testUser = await BuildAuthorizedTest(_factory);

        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userToDeleteManually = await dbContext.Users.FindAsync(testUser.AuthorizedUser.Id);
        if (userToDeleteManually != null)
        {
            dbContext.Users.Remove(userToDeleteManually);
            await dbContext.SaveChangesAsync();
        }

        // Act
        var response = await testUser.AuthorizedHttpClient.DeleteAsync("/api/users/me");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}