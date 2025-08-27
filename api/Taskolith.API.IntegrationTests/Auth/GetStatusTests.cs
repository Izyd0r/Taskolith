using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Auth.Status;

namespace Taskolith.API.IntegrationTests.Auth;

public class GetStatusTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task GetStatus_Should_ReturnOkAndCorrectUserData_WhenUserIsAuthenticated()
    {
        var testUser = await BuildAuthorizedTest(_factory);
        var response = await testUser.AuthorizedHttpClient.GetAsync("/api/auth/status");
        response.StatusCode.Should().Be(HttpStatusCode.OK, 
            $"because the request should be successful. Server response: {await response.Content.ReadAsStringAsync()}");
        
        var statusResponse = await response.Content.ReadFromJsonAsync<GetStatusResponse>();
        statusResponse.Should().NotBeNull();
        statusResponse.UserId.Should().Be(testUser.AuthorizedUser.Id);
        statusResponse.Email.Should().Be(testUser.AuthorizedUser.Email);
        statusResponse.Username.Should().Be(testUser.AuthorizedUser.Username);
    }

    [Fact]
    public async Task GetStatus_Should_ReturnUnauthorized_WhenTokenIsMissing()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/auth/status");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}