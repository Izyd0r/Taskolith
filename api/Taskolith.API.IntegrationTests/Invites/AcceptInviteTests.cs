using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.InviteSystem.Requests;
using Taskolith.API.InviteSystem.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Invites;

public class AcceptInviteTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Accept_Invite_And_Return_OK() {
        // User 1 (Admin)
        var userOne = await BuildAuthorizedTest(_factory);
        // User 2 (Invited)
        var userTwo = await BuildAuthorizedTest(_factory);
        var firstRequest = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", firstRequest);
        var readResponse = response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var secondRequest = new InviteMemberRequest(userTwo.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var responseFromInvite = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{readResponse.Result.OrganisationId}/invitations",secondRequest);
        var readFromInviteResponse = responseFromInvite.Content.ReadFromJsonAsync<InviteMemberResponse>();
        var responseFromAcceptingInvite = await userTwo.AuthorizedHttpClient.PostAsync($"/api/invitations/{readFromInviteResponse.Result.InviteMemberId}/accept", null);
        responseFromAcceptingInvite.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}