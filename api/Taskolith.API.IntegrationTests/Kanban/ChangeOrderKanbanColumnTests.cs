using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Kanban;

public class ChangeOrderKanbanColumnTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Update_Kanban_Column_Order_And_Return_NoContent() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await test.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var contentProject = await responseFromProjectCreation.Content
            .ReadFromJsonAsync<CreateProjectResponse>();
        var kanbanCreationRequest = new CreateKanbanColumnRequest("ToDo");
        var responseFromKanbanCreation = await test.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns", kanbanCreationRequest);
        responseFromKanbanCreation.Should().NotBeNull();
        responseFromKanbanCreation.StatusCode.Should().Be(HttpStatusCode.Created);
        var contentFromKanbanCreation = await responseFromKanbanCreation.Content.ReadFromJsonAsync<CreateKanbanColumnResponse>();
        var updateRequest = new ChangeOrderKanbanColumnRequest(contentFromKanbanCreation!.KanbanColumnId,2);
        var responseFromUpdate = await test.AuthorizedHttpClient
            .PutAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/reorder", updateRequest);
        responseFromUpdate.Should().NotBeNull();
        responseFromUpdate.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}