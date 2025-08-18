using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class UpdateProjectTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;
   
    [Fact]
    public async Task Should_Update_Project_And_Return_No_Content() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var createProjectRequest = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var contentFromCreateProject = await createProjectRequest.Content.ReadFromJsonAsync<CreateProjectResponse>();
        var updateRequest = new UpdateProjectRequest("Backend API 2", "Project for ABC firm");
        var updateProjectResponse = await test.AuthorizedHttpClient.PutAsJsonAsync(
            $"/api/organisations/{content?.OrganisationId}/projects/{contentFromCreateProject?.ProjectId}",updateRequest);
        updateProjectResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
        updateProjectResponse.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{content?.OrganisationId}/projects/{contentFromCreateProject?.ProjectId}");
    } 
}