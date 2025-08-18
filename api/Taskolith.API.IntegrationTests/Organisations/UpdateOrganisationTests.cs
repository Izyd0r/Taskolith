using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Organisations;

public class UpdateOrganisationTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Only_Admin_Of_Organization_Can_Update_Organisation_Name() {
        // User 1 (Admin)
        var userOne = await BuildAuthorizedTest(_factory);
        var organisationCreationRequest = new CreateOrganisationRequest("Organisation"); 
        var responseFromOrganisationCreation = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", organisationCreationRequest);
        var readFromCreationResponse = responseFromOrganisationCreation.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        // User 2 
        var userTwo = await BuildAuthorizedTest(_factory);
        var organisationUpdateRequest = new UpdateOrganisationRequest(readFromCreationResponse.Result.OrganisationId,"New Organisation");
        var updateResponse = await userTwo.AuthorizedHttpClient.PutAsJsonAsync("/api/organisations", organisationUpdateRequest);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Fact]
    public async Task Admin_Cant_Update_Other_Organisation_Name() {
        // User 1 (Admin)
        var userOne = await BuildAuthorizedTest(_factory);
        var organisationCreationRequest = new CreateOrganisationRequest("Organisation"); 
        var responseFromOrganisationCreation = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", organisationCreationRequest);
        var readFromCreationResponse = responseFromOrganisationCreation.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        // User 2 (Admin)
        var userTwo = await BuildAuthorizedTest(_factory);
        var secondOrganisationCreationRequest = new CreateOrganisationRequest("Organisation Two"); 
        await userTwo.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", secondOrganisationCreationRequest);
        var organisationUpdateRequest = new UpdateOrganisationRequest(readFromCreationResponse.Result.OrganisationId,"New Organisation");
        var updateResponse = await userTwo.AuthorizedHttpClient.PutAsJsonAsync("/api/organisations", organisationUpdateRequest);
        updateResponse.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}