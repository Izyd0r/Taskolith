using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class DeleteProjectTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Delete_Project_And_Return_NoContent()
    {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var createProjectRequest =
            await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects",
                projectCreationRequest);
        var contentFromCreateProject = await createProjectRequest.Content.ReadFromJsonAsync<CreateProjectResponse>();
        var responseFromDelete = await test.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentFromCreateProject!.ProjectId}");
        responseFromDelete.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}