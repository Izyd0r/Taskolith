using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Organisations.CreateOrganisation;
using Taskolith.API.OrganizationManagement.Roles;
using Taskolith.API.OrganizationManagement.Roles.Requests;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Roles;

public class CreateRoleTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Create_Role_Should_Return_Created_And_Role_Id() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var createRoleRequest = new CreateRoleRequest("Developer", Permission.InviteMember, [userTwo.AuthorizedUser.Id]);
        var responseRole = await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{responseContent?.OrganisationId}/roles", createRoleRequest);
        responseRole.StatusCode.Should().Be(HttpStatusCode.Created);
        var role = await responseRole.Content.ReadFromJsonAsync<CreateRoleResponse>();
        responseRole.Headers.Location.Should().Be($"/api/organisations/{responseContent?.OrganisationId}/roles/{role?.RoleId}");
        role?.RoleId.Should().NotBe(Guid.Empty);
    }
    
    // TODO: add integration tests that check permissions
}