using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Organisations;

public class CreateOrganisationTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Create_Organisation_Should_Return_Created_Organization() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var responseFromCreateOrganisation = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>(); 
        response.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
    }
}