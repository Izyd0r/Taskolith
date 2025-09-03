using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Taskolith.API.Data;
using Taskolith.API.Data.Types;
using Taskolith.API.InviteSystem.Requests;
using Taskolith.API.InviteSystem.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Invites;

public class RevokeInvitationTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task RevokeInvitation_Should_ReturnNoContent_WhenOrganisationCreatorRevokes()
    {
        // ARRANGE
        var orgCreator = await BuildAuthorizedTest(_factory);
        var invitee = await BuildAuthorizedTest(_factory);

        var createOrgRequest = new CreateOrganisationRequest("Test Organisation");
        var createOrgResponse = await orgCreator.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrgRequest);
        var org = await createOrgResponse.Content.ReadFromJsonAsync<CreateOrganisationResponse>();

        var inviteRequest = new InviteMemberRequest(invitee.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var inviteResponse = await orgCreator.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{org.OrganisationId}/invitations", inviteRequest);
        var invitation = await inviteResponse.Content.ReadFromJsonAsync<InviteMemberResponse>();

        var url = $"/api/organisations/{org.OrganisationId}/invitations/{invitation.InviteId}";

        // ACT
        var response = await orgCreator.AuthorizedHttpClient.DeleteAsync(url);

        // ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var invitationInDb = await dbContext.Invitations.FindAsync(invitation.InviteId);
        invitationInDb.Should().NotBeNull();
        invitationInDb.Status.Should().Be(InvitationStatus.Revoked);
    }

    [Fact]
    public async Task RevokeInvitation_Should_ReturnForbidden_WhenNonMemberRevokes()
    {
        // ARRANGE
        var orgCreator = await BuildAuthorizedTest(_factory);
        var invitee = await BuildAuthorizedTest(_factory);
        var nonMember = await BuildAuthorizedTest(_factory);

        var createOrgRequest = new CreateOrganisationRequest("Test Organisation");
        var createOrgResponse = await orgCreator.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrgRequest);
        var org = await createOrgResponse.Content.ReadFromJsonAsync<CreateOrganisationResponse>();

        var inviteRequest = new InviteMemberRequest(invitee.AuthorizedUser.Email, DateTime.UtcNow.AddDays(7));
        var inviteResponse = await orgCreator.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{org.OrganisationId}/invitations", inviteRequest);
        var invitation = await inviteResponse.Content.ReadFromJsonAsync<InviteMemberResponse>();

        var url = $"/api/organisations/{org.OrganisationId}/invitations/{invitation.InviteId}";

        // ACT
        var response = await nonMember.AuthorizedHttpClient.DeleteAsync(url);

        // ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Fact]
    public async Task RevokeInvitation_Should_ReturnUnauthorized_WhenTokenIsMissing()
    {
        // ARRANGE
        var client = _factory.CreateClient();
        var url = $"/api/organisations/{Guid.NewGuid()}/invitations/{Guid.NewGuid()}";

        // ACT
        var response = await client.DeleteAsync(url);

        // ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}