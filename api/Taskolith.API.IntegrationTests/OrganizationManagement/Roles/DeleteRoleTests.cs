using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.OrganizationManagement.Roles.Requests;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Roles;

public class DeleteRoleTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Delete_Role_And_Return_Ok() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var createRoleRequest = new CreateRoleRequest("Developer", Permission.InviteMember);
        var responseRole = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles", createRoleRequest);
        responseRole.StatusCode.Should().Be(HttpStatusCode.Created);
        var role = await responseRole.Content.ReadFromJsonAsync<CreateRoleResponse>();
        var deleteResponse = await userOne.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{responseContent?.OrganisationId}/roles/{role!.RoleId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
    
    [Fact]
    public async Task Should_Return_Forbidden_When_Member_Does_Not_Have_Permission() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var createRoleRequest = new CreateRoleRequest("Developer", Permission.InviteMember);
        var responseRole = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles", createRoleRequest);
        responseRole.StatusCode.Should().Be(HttpStatusCode.Created);
        var role = await responseRole.Content.ReadFromJsonAsync<CreateRoleResponse>();
        var deleteResponse = await userTwo.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{responseContent?.OrganisationId}/roles/{role!.RoleId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    } 
}