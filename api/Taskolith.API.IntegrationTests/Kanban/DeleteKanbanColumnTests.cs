using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Kanban;

public class DeleteKanbanColumnTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Delete_KanbanColumn_And_Return_NoContent() {
        var user = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await user.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await user.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var contentProject = await responseFromProjectCreation.Content.ReadFromJsonAsync<CreateProjectResponse>();
        var kanbanCreationRequest = new CreateKanbanColumnRequest("ToDo");
        var responseFromKanbanCreation = await user.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns", kanbanCreationRequest);
        var contentFromCreate = responseFromKanbanCreation.Content.ReadFromJsonAsync<CreateKanbanColumnResponse>();
        var responseFromDelete = user.AuthorizedHttpClient.DeleteAsync(
            $"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/{contentFromCreate?.Result?.KanbanColumnId}");
        responseFromDelete.Result?.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}