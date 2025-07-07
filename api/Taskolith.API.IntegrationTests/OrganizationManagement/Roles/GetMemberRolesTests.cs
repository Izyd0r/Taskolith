using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Members.Responses;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Roles;

public class GetMemberRoles(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Get_All_Member_Roles_And_Return_Ok() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var member = DbContext.OrganisationMembers.FirstOrDefault(m => m.UserId == userOne.AuthorizedUser.Id);
        var responseFromGetRoles = await userOne.AuthorizedHttpClient.GetAsync($"/api/organisations/{responseContent?.OrganisationId}/members/{member?.Id}/roles");
        responseFromGetRoles.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await responseFromGetRoles.Content.ReadFromJsonAsync<GetMemberRolesResponse>();
        
        var allPermissions = Enum.GetValues(typeof(Permission))
            .Cast<Permission>()
            .Aggregate((current, next) => current | next);
        
        content.Should().NotBeNull();
        content.Roles.Count.Should().Be(1);
        content.Roles[0].Name.Should().Be("Admin");
        content.Roles[0].Permissions.Should().Be(allPermissions);
        content.Roles[0].OrganisationId.Should().Be(responseContent!.OrganisationId);
    }
}