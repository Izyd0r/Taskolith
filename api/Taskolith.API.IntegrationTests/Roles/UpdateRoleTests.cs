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

public class UpdateRoleTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Update_Role_And_Return_Ok() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var createRoleRequest = new CreateRoleRequest("Developer", Permission.InviteMember);
        var responseRole = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles", createRoleRequest);
        var role = await responseRole.Content.ReadFromJsonAsync<CreateRoleResponse>();
        var updateRequest = new UpdateRoleRequest("HR", Permission.InviteMember | Permission.KickMember );
        var responseFromUpdateRole = await userOne.AuthorizedHttpClient.PutAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles/{role?.RoleId}", updateRequest);
        responseFromUpdateRole.StatusCode.Should().Be(HttpStatusCode.OK);
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
        var role = await responseRole.Content.ReadFromJsonAsync<CreateRoleResponse>();
        var updateRequest = new UpdateRoleRequest("HR", Permission.InviteMember | Permission.KickMember );
        var responseFromUpdateRole = await userTwo.AuthorizedHttpClient.PutAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles/{role?.RoleId}", updateRequest);
        responseFromUpdateRole.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    } 
}