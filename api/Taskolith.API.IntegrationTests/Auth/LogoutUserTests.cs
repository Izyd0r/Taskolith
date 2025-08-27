using System.Net;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Taskolith.API.IntegrationTests.Auth;

public class LogoutUserTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task Logout_WhenUserIsLoggedIn_ShouldDeactivateRefreshTokenAndClearCookies()
    {
        var client = await BuildAuthorizedTest(_factory); 
    
        var initialRefreshToken = await DbContext.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.UserId == client.AuthorizedUser.Id);
    
        initialRefreshToken.Should().NotBeNull();
        initialRefreshToken.IsActive.Should().BeTrue();
    
        var logoutResponse = await client.AuthorizedHttpClient.PostAsync("/api/auth/logout", null);
    
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