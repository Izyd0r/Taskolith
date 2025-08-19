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
        var testClient = await BuildAuthorizedTest(_factory);

        var createOrgRequest = new CreateOrganisationRequest("Organisation");
        var createOrgResponse = await testClient.AuthorizedHttpClient
            .PostAsJsonAsync("/api/organisations", createOrgRequest);
        var organisation = await createOrgResponse.Content.ReadFromJsonAsync<CreateOrganisationResponse>();

        var createProjectRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var createProjectResponseMessage = await testClient.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{organisation?.OrganisationId}/projects", createProjectRequest);
        var project = await createProjectResponseMessage.Content.ReadFromJsonAsync<CreateProjectResponse>();

        var updateProjectRequest = new UpdateProjectRequest("Backend API 2", "Project for ABC firm");
        var updateProjectResponseMessage = await testClient.AuthorizedHttpClient
            .PutAsJsonAsync($"/api/organisations/{organisation?.OrganisationId}/projects/{project?.ProjectId}", updateProjectRequest);

        updateProjectResponseMessage.StatusCode.Should().Be(HttpStatusCode.OK);
        updateProjectResponseMessage.Headers.Location?.OriginalString
            .Should().Be($"/api/organisations/{organisation?.OrganisationId}/projects/{project?.ProjectId}");

        var updatedProject = await updateProjectResponseMessage.Content.ReadFromJsonAsync<UpdateProjectResponse>();
        updatedProject.ProjectName.Should().Be(updateProjectRequest.Name);
        updatedProject.ProjectDescription.Should().Be(updateProjectRequest.Description);
    } 
}