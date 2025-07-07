using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.OrganizationManagement.InviteSystem.InviteMember;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Invites;

public class InviteMemberTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Invite_Member_To_Organization_And_Return_Created() {
        // User 1 (Admin)
        var userOne = await BuildAuthorizedTest(_factory);
        // User 2 (Invited)
        var userTwo = await BuildAuthorizedTest(_factory);
        var firstRequest = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", firstRequest);
        var readResponse = response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var secondRequest = new InviteMemberRequest(userTwo.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var responseFromInvite = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{readResponse.Result.OrganisationId}/invitations",secondRequest);
        responseFromInvite.StatusCode.Should().Be(HttpStatusCode.Created);
        responseFromInvite.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{readResponse.Result.OrganisationId}/invitations");
        var readResponseFromInvite = responseFromInvite.Content.ReadFromJsonAsync<InviteMemberResponse>();
        readResponseFromInvite.Result.Should().NotBeNull();
        readResponseFromInvite.Result.OrganisationId.Should().Be(readResponse.Result.OrganisationId);
        readResponseFromInvite.Result.Email.Should().Be(secondRequest.Email);
        readResponseFromInvite.Result.DueDate.Should().Be(secondRequest.DueDate);
        readResponseFromInvite.Result.Status.Should().Be("Pending");
    }

    [Fact]
    public async Task Member_Without_Permission_Cannot_Add_User_Should_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var firstRequest = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", firstRequest);
        var readResponse = response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var secondRequest = new InviteMemberRequest(userTwo.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var responseFromInvite = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{readResponse.Result.OrganisationId}/invitations",secondRequest);
        responseFromInvite.StatusCode.Should().Be(HttpStatusCode.Created);
        var thirdRequest = new InviteMemberRequest(userTwo.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var responseFromNotAllowedInvite = await userTwo.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{readResponse.Result.OrganisationId}/invitations",thirdRequest);
        responseFromNotAllowedInvite.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}