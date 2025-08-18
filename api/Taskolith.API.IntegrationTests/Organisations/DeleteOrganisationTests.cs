using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Organisations;

public class DeleteOrganisationTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Delete_Organisation_That_Exists() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var responseFromCreateOrganisation = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>(); 
        response.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
        var deleteOrganisationResponse = await test.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
        deleteOrganisationResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Should_Return_Forbid_When_User_Dont_Have_Permission() {
        // First User (Admin)
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var responseFromCreateOrganisation = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>(); 
        response.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
        // Second User
        var testTwo = await BuildAuthorizedTest(_factory);
        var deleteOrganisationResponseTwo = await testTwo.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
        deleteOrganisationResponseTwo.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Fact]
    public async Task User_With_Admin_Role_Should_Not_Be_Able_To_Delete_Organisation_That_Are_Not_His() {
        // First User (Admin)
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var responseFromCreateOrganisation = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>(); 
        response.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
        // Second User (Admin)
        var testTwo = await BuildAuthorizedTest(_factory);
        var requestTwo = new CreateOrganisationRequest("Organisation 2");
        var responseTwo = await testTwo.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", requestTwo);
        responseTwo.StatusCode.Should().Be(HttpStatusCode.Created);
        var responseFromCreateOrganisationTwo = await responseTwo.Content.ReadFromJsonAsync<CreateOrganisationResponse>(); 
        responseTwo.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{responseFromCreateOrganisationTwo!.OrganisationId}"); 
        var deleteOrganisationResponseTwo = await testTwo.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{responseFromCreateOrganisation!.OrganisationId}");
        deleteOrganisationResponseTwo.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}