using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Members;

public class KickMemberTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Kick_Member_Out_Of_Organisation_And_Return_NoContent() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        DbContext.Users.Attach(userTwo.AuthorizedUser);
        var member = new Membership() {
            Id = Guid.NewGuid(),
            OrganisationId = responseContent!.OrganisationId,
            UserId = userTwo.AuthorizedUser.Id,
            User = userTwo.AuthorizedUser,
        };
        DbContext.OrganisationMembers.Add(member);
        await DbContext.SaveChangesAsync();
        var responseFromKicking = await userOne.AuthorizedHttpClient
            .DeleteAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{member.Id}");
        responseFromKicking.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
    
    [Fact]
    public async Task Outside_User_Cant_Kick_Member_Inside_Organisation_Should_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var member = DbContext.OrganisationMembers
            .FirstOrDefault(m => m.UserId == userOne.AuthorizedUser.Id && m.OrganisationId == responseContent!.OrganisationId);
        var responseFromKicking = await userTwo.AuthorizedHttpClient
            .DeleteAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}");
        responseFromKicking.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Cant_Kick_Member_That_Dont_Exist_Should_Return_NotFound() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var responseFromKicking = await userOne.AuthorizedHttpClient
            .DeleteAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{Guid.NewGuid()}");
        responseFromKicking.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}