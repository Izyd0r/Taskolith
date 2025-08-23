using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;

namespace Taskolith.API.IntegrationTests.Auth;

public class RefreshTokenTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task Refresh_WithValidToken_ShouldRotateTokensAndReturnNewCookies()
    {
        var client = _factory.CreateClient();
        var user = new User
        {
            Username = "refresh-test",
            Password = "Password123!",
            Email = "refresh@test.com",
            FirstName = "Test",
            LastName = "User"
        };
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();

        var loginRequest = new LoginRequest(user.Username, user.Password);
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.EnsureSuccessStatusCode();

        var originalRefreshToken = await DbContext.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.UserId == user.Id);
        
        originalRefreshToken.Should().NotBeNull();

        var refreshResponse = await client.PostAsync("/api/auth/refresh", null);

        refreshResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var usedRefreshToken = await DbContext.RefreshTokens.FindAsync(originalRefreshToken.Id);
        usedRefreshToken.IsActive.Should().BeFalse();

        var newRefreshToken = await DbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.UserId == user.Id && rt.IsActive);
        newRefreshToken.Should().NotBeNull();
        newRefreshToken.Token.Should().NotBe(originalRefreshToken.Token);

        var setCookieHeader = refreshResponse.Headers.GetValues("Set-Cookie");
        setCookieHeader.Should().Contain(c => c.StartsWith("access_token="));
        setCookieHeader.Should().Contain(c => c.StartsWith("refresh_token="));
    }

    [Fact]
    public async Task Refresh_WithoutToken_ShouldReturnUnauthorized()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsync("/api/auth/refresh", null);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Refresh_WithReusedDeactivatedToken_ShouldReturnUnauthorized()
    {
        var standardClient = _factory.CreateClient();
        var user = new User
        {
            Username = "reuse-test",
            Password = "Password123!",
            Email = "reuse@test.com",
            FirstName = "Test",
            LastName = "User"
        };
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();
    
        await standardClient.PostAsJsonAsync("/api/auth/login", new LoginRequest(user.Username, user.Password));
        
        var originalToken = await DbContext.RefreshTokens.AsNoTracking().FirstAsync(rt => rt.UserId == user.Id);
        originalToken.Should().NotBeNull();
    
        var firstRefreshResponse = await standardClient.PostAsync("/api/auth/refresh", null);
        firstRefreshResponse.EnsureSuccessStatusCode();
    
        var originalTokenInDb = await DbContext.RefreshTokens.FindAsync(originalToken.Id);
        originalTokenInDb.Should().NotBeNull();
        originalTokenInDb.IsActive.Should().BeFalse("because the first refresh should have deactivated it");
    
        var attackerClient = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = false
        });
    
        var reuseRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        reuseRequest.Headers.Add("Cookie", $"refresh_token={originalToken.Token}");
        var secondRefreshResponse = await attackerClient.SendAsync(reuseRequest);
    
        secondRefreshResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}