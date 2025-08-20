using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.OrganizationManagement.Roles.Responses;
using Taskolith.API.Roles.Requests;
using Taskolith.API.Roles.Responses;

namespace Taskolith.API.IntegrationTests.Roles;

public class GetRolesTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Get_All_Roles_Inside_Organisation_And_Return_Ok() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var createRoleRequest = new CreateRoleRequest("Developer", Permission.InviteMember);
        await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles", createRoleRequest);
        var responseRoles = await userOne.AuthorizedHttpClient.GetAsync($"/api/organisations/{responseContent?.OrganisationId}/roles");
        responseRoles.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = responseRoles.Content.ReadFromJsonAsync<GetRolesResponse>();
        content.Should().NotBeNull();
        var rolesContent = await content;
        rolesContent!.Roles.Count.Should().Be(3);
        foreach (var role in rolesContent!.Roles) {
            role.Should().NotBeNull();
        }
    }
}