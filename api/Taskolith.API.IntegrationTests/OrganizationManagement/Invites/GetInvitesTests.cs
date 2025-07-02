using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.InviteSystem.GetInvites;
using Taskolith.API.OrganizationManagement.InviteSystem.InviteMember;
using Taskolith.API.OrganizationManagement.Organisations.CreateOrganisation;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Invites;

public class GetInvitesTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task User_Should_Get_All_Invites() {
        var userOne = await BuildAuthorizedTest(_factory);
        var createOrganisationRequest = new CreateOrganisationRequest("Organisation");
        var responseFromOrganisationCreation = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrganisationRequest);
        var readResponse = await responseFromOrganisationCreation.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var userTwo = await BuildAuthorizedTest(_factory);
        var inviteMemberRequest = new InviteMemberRequest(userTwo.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/{readResponse.OrganisationId}/invitations", inviteMemberRequest);
        var response = await userTwo.AuthorizedHttpClient.GetAsync($"/api/invitations");
        var invites = await response.Content.ReadFromJsonAsync<GetInvitesResponse>();
        response.EnsureSuccessStatusCode();
        foreach (var invite in invites!.Invites) {
            invite.Should().NotBeNull();
            invite.OrganisationId.Should().Be(readResponse.OrganisationId);
            invite.Expired.Should().BeFalse();
            invite.Status.Should().BeOneOf("Pending","Accepted","Rejected");
        }
    }
}