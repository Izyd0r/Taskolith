using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.Members.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Members;

public class GetOrganisationsMembersTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Get_All_Members_Inside_Organisation_And_Return_Ok() {
        var userOne = await BuildAuthorizedTest(_factory);
        var createOrgRequest = new CreateOrganisationRequest("Organisation");
        var createOrgResponse = await userOne.AuthorizedHttpClient
            .PostAsJsonAsync("/api/organisations", createOrgRequest);
        var orgContent = await createOrgResponse.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var organisationId = orgContent!.OrganisationId;

        var userTwo = await BuildAuthorizedTest(_factory);

        DbContext.Users.Attach(userTwo.AuthorizedUser);

        var memberRole = new Role {
            Id = Guid.NewGuid(),
            Name = "Member",
            OrganisationId = organisationId,
            Permissions = Permission.Public
        };

        var membershipForUserTwo = new Membership {
            Id = Guid.NewGuid(),
            OrganisationId = organisationId,
            UserId = userTwo.AuthorizedUser.Id,
            User = userTwo.AuthorizedUser,
            Roles = [memberRole]
        };

        DbContext.OrganisationMembers.Add(membershipForUserTwo);
        await DbContext.SaveChangesAsync();

        var getMembersResponse = await userOne.AuthorizedHttpClient
            .GetAsync($"/api/organisations/{organisationId}/members");

        getMembersResponse.Should().NotBeNull();
        getMembersResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var members = await getMembersResponse.Content.ReadFromJsonAsync<GetMembersApiResponse>();
        members.Should().NotBeNull();
        members!.Members.Count.Should().Be(2);

        var memberOne = members.Members.FirstOrDefault(m => m.Member.UserId == userOne.AuthorizedUser.Id);
        var memberTwo = members.Members.FirstOrDefault(m => m.Member.UserId == userTwo.AuthorizedUser.Id);

        memberOne.Should().NotBeNull();
        memberTwo.Should().NotBeNull();

        memberOne!.Member.OrganisationId.Should().Be(organisationId);
        memberTwo!.Member.OrganisationId.Should().Be(organisationId);

        memberOne.Roles.Should().ContainSingle(r => r.Name == "Admin");
        memberTwo.Roles.Should().ContainSingle(r => r.Name == "Member");
    }

    [Fact]
    public async Task Outside_User_Cant_Get_All_Members_Of_Organisation_And_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var userTwo = await BuildAuthorizedTest(_factory);
        var responseFromGetMembers = await userTwo.AuthorizedHttpClient.GetAsync($"/api/organisations/{responseContent!.OrganisationId}/members");
        responseFromGetMembers.Should().NotBeNull();
        responseFromGetMembers.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}