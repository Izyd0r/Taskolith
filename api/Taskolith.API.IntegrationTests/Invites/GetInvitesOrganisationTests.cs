using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.InviteSystem.Requests;
using Taskolith.API.InviteSystem.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Invites;

public class GetInvitesOrganisationTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Member_With_Invite_Permissions_Should_Be_Able_To_Get_All_Pending_Invites() {
        var userOne = await BuildAuthorizedTest(_factory);
        var createOrganisationRequest = new CreateOrganisationRequest("Organisation");
        var responseFromOrganisationCreation = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrganisationRequest);
        var readResponse = await responseFromOrganisationCreation.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var userTwo = await BuildAuthorizedTest(_factory);
        var inviteMemberRequest = new InviteMemberRequest(userTwo.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var responeFromInvite = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{readResponse!.OrganisationId}/invitations", inviteMemberRequest);
        responeFromInvite.EnsureSuccessStatusCode();
        var response = await userOne.AuthorizedHttpClient.GetAsync($"/api/organisations/{readResponse.OrganisationId}/invitations");
        response.EnsureSuccessStatusCode();
        var pendingInvites = await response.Content.ReadFromJsonAsync<GetInvitesOrganisationResponse>();
        pendingInvites?.Invites.Should().NotBeEmpty();
        pendingInvites?.Invites.Should().HaveCount(1);
        pendingInvites?.Invites[0].OrganisationId.Should().Be(readResponse.OrganisationId);
        pendingInvites?.Invites[0].InvitedUserEmail.Should().Be(userTwo.AuthorizedUser.Email);
    }
}