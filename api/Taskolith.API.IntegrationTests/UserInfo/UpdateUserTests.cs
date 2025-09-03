using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.UserInfo.Requests;
using Taskolith.API.UserInfo.Response;

namespace Taskolith.API.IntegrationTests.UserInfo;

public class UpdateUserTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task UpdateUser_Should_ReturnOkAndUpdatedData_WhenRequestIsValid()
    {
        // Arrange
        var testUser = await BuildAuthorizedTest(_factory);
        var newUserData = new UpdateUserRequest(
            "new-test-username",
            "new-email@example.com",
            null
        );

        // Act
        var response = await testUser.AuthorizedHttpClient.PutAsJsonAsync("/api/users/me", newUserData);

        // Assert 
        response.StatusCode.Should().Be(HttpStatusCode.OK, 
            $"because the update request should be successful. Server response: {await response.Content.ReadAsStringAsync()}");
        
        var updatedUserResponse = await response.Content.ReadFromJsonAsync<UpdateUserResponse>();
        updatedUserResponse.Should().NotBeNull();
        updatedUserResponse.Username.Should().Be(newUserData.Username);
        updatedUserResponse.Email.Should().Be(newUserData.Email);

        // Assert
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userInDb = await dbContext.Users.FindAsync(testUser.AuthorizedUser.Id);
        userInDb.Should().NotBeNull();
        userInDb.Username.Should().Be(newUserData.Username);
        userInDb.Email.Should().Be(newUserData.Email);
    }

    [Fact]
    public async Task UpdateUser_Should_ReturnUnauthorized_WhenTokenIsMissing()
    {
        // Arrange
        var client = _factory.CreateClient();
        var newUserData = new UpdateUserRequest("any-user", "any@email.com", "any-password");

        // Act
        var response = await client.PutAsJsonAsync("/api/users/me", newUserData);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateUser_Should_ReturnConflict_WhenEmailIsAlreadyTaken()
    {
        // Arrange
        var userA = await BuildAuthorizedTest(_factory);

        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userB = new User
        {
            Id = Guid.NewGuid(),
            Username = "userB",
            Email = "taken-email@example.com",
            Password = "somehash",
            FirstName = "Jan",
            LastName = "Kowalski"
        };
        dbContext.Users.Add(userB);
        await dbContext.SaveChangesAsync();
        
        var request = new UpdateUserRequest(null, userB.Email, null);

        // Act
        var response = await userA.AuthorizedHttpClient.PutAsJsonAsync("/api/users/me", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
    
    [Fact]
    public async Task UpdateUser_Should_ReturnConflict_WhenUsernameIsAlreadyTaken()
    {
        var userA = await BuildAuthorizedTest(_factory);
        
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userB = new User
        {
            Id = Guid.NewGuid(),
            Username = "taken-username",
            Email = "userB@example.com",
            Password = "somehash",
            FirstName = "Jan",
            LastName = "Kowalski"
        };
        dbContext.Users.Add(userB);
        await dbContext.SaveChangesAsync();
        
        var request = new UpdateUserRequest(userB.Username, null, null);

        // Act
        var response = await userA.AuthorizedHttpClient.PutAsJsonAsync("/api/users/me", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task UpdateUser_Should_UpdatePasswordHash_WhenOnlyPasswordIsProvided()
    {
        // Arrange
        var testUser = await BuildAuthorizedTest(_factory);
        
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userInDb = await dbContext.Users.FindAsync(testUser.AuthorizedUser.Id);
        var originalPasswordHash = userInDb.Password;

        var request = new UpdateUserRequest(null, null, "MyNewSecurePassword123!");
        
        // Act
        var response = await testUser.AuthorizedHttpClient.PutAsJsonAsync("/api/users/me", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        dbContext.Entry(userInDb).State = Microsoft.EntityFrameworkCore.EntityState.Detached;
        var updatedUserInDb = await dbContext.Users.FindAsync(testUser.AuthorizedUser.Id);
        
        updatedUserInDb.Password.Should().NotBeNullOrWhiteSpace();
        updatedUserInDb.Password.Should().NotBe(originalPasswordHash, "because the password should have been re-hashed.");
    }
}