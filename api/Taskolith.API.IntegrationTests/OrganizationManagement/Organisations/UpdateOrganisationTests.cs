using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Organisations;

public class UpdateOrganisationTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Update_Organisation_Name() {
        var test = await BuildAuthorizedTest(_factory);
        var organisationCreationRequest = new CreateOrganisationRequest("Organisation"); 
        var responseFromOrganisationCreation = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", organisationCreationRequest);
        var readFromCreationResponse = responseFromOrganisationCreation.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var organisationUpdateRequest = new UpdateOrganisationRequest(readFromCreationResponse.Result.OrganisationId,"New Organisation");
        var responseFromOrganisationUpdate = await test.AuthorizedHttpClient.PutAsJsonAsync("/api/organisations", organisationUpdateRequest);
        responseFromOrganisationUpdate.StatusCode.Should().Be(HttpStatusCode.OK);
        var readFromUpdateResponse = responseFromOrganisationUpdate.Content.ReadFromJsonAsync<UpdateOrganisationResponse>();
        readFromUpdateResponse.Should().NotBeNull();
        readFromUpdateResponse.Result.OrganisationId.Should().Be(organisationUpdateRequest.OrganisationId);
        readFromUpdateResponse.Result.Name.Should().Be(organisationUpdateRequest.OrganisationName);
    }

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