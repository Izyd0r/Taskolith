using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Members.Responses;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Members;

public class GetOrganisationsMembersTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Get_All_Members_Inside_Organisation_And_Return_Ok() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var userTwo = await BuildAuthorizedTest(_factory);
        var memberOne = new Membership() {
            Id = Guid.NewGuid(),
            OrganisationId = responseContent!.OrganisationId,
            UserId = userTwo.AuthorizedUser.Id,
            Roles = [new Role() {
                Id = Guid.NewGuid(),
                Name = "Member",
                OrganisationId = responseContent!.OrganisationId,
                Permissions = Permission.Public
            }]
        };
        DbContext.OrganisationMembers.Add(memberOne);
        await DbContext.SaveChangesAsync();
        var responseFromGetMembers = await userOne.AuthorizedHttpClient.GetAsync($"/api/organisations/{responseContent.OrganisationId}/members");
        responseFromGetMembers.Should().NotBeNull();
        responseFromGetMembers.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await responseFromGetMembers.Content.ReadFromJsonAsync<List<GetOrganisationMembersResponse>>();
        content!.Count.Should().Be(2);
        content[0].UserId.Should().Be(userOne.AuthorizedUser.Id);
        content[1].UserId.Should().Be(userTwo.AuthorizedUser.Id);
        content[0].Roles.Should().HaveCount(1);
        content[1].Roles.Should().HaveCount(1);
        content[0].OrganisationId.Should().Be(responseContent!.OrganisationId);
        content[1].OrganisationId.Should().Be(responseContent!.OrganisationId);
        content[0].Roles.ElementAt(0).Name.Should().Be("Admin");
        content[1].Roles.ElementAt(0).Name.Should().Be("Member");
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