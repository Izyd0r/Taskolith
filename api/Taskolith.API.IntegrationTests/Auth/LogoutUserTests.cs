using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;

namespace Taskolith.API.IntegrationTests.Auth;

public class LogoutUserTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task Logout_WhenUserIsLoggedIn_ShouldDeactivateRefreshTokenAndClearCookies()
    {
        PasswordHasher<User> passwordHasher = new();
        var client = _factory.CreateClient();
        var user = new User
        {
            Username = "logout-test",
            Password = "Password123!",
            Email = "logout@test.com",
            FirstName = "Test",
            LastName = "User"
        };
        var passwordRequest = user.Password;
        user.Password = passwordHasher.HashPassword(user, user.Password);
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();
    
        var loginRequest = new LoginRequest(user.Username, passwordRequest);
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.EnsureSuccessStatusCode();
    
        var initialRefreshToken = await DbContext.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.UserId == user.Id);
    
        initialRefreshToken.Should().NotBeNull();
        initialRefreshToken.IsActive.Should().BeTrue();
    
        var logoutResponse = await client.PostAsync("/api/auth/logout", null);
    
        logoutResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
    
        var finalRefreshToken = await DbContext.RefreshTokens.FindAsync(initialRefreshToken.Id);
        finalRefreshToken.Should().NotBeNull();
        finalRefreshToken.IsActive.Should().BeFalse();
    
        var setCookieHeader = logoutResponse.Headers.GetValues("Set-Cookie");
        setCookieHeader.Should().Contain(c => c.StartsWith("access_token=;") && c.Contains("expires=Thu, 01 Jan 1970"));
        setCookieHeader.Should().Contain(c => c.StartsWith("refresh_token=;") && c.Contains("expires=Thu, 01 Jan 1970"));
    }
    
    [Fact]
    public async Task Logout_WhenUserIsNotLoggedIn_ShouldReturnSuccess()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsync("/api/auth/logout", null);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}