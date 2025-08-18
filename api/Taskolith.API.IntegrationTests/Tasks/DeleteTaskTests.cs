using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;
using Taskolith.API.Tasks;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.Responses;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Tasks;

public class DeleteTaskTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : AuthorizedIntegrationTest(factory) {
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Delete_Task_That_Exist_And_Return_NoContent() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var contentProject = await responseFromProjectCreation.Content.ReadFromJsonAsync<CreateProjectResponse>();
        var kanbanCreationRequest = new CreateKanbanColumnRequest("ToDo");
        var responseFromKanbanCreation = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns", kanbanCreationRequest);
        var contentFromKanbanCreation = await responseFromKanbanCreation.Content.ReadFromJsonAsync<CreateKanbanColumnResponse>();
        
        var createTaskRequest = new CreateTaskRequest("Title", "Description", DateTime.UtcNow.AddDays(7), new List<Guid>(), 1, Priority.Critical);
        var responseFromCreateTask = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/{contentFromKanbanCreation!.KanbanColumnId}/tasks", createTaskRequest);
        
        var createTaskResponse = await responseFromCreateTask.Content.ReadFromJsonAsync<CreateTaskResponse>();
        var responseFromDelete = await test.AuthorizedHttpClient.DeleteAsync(
            $"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/{contentFromKanbanCreation!.KanbanColumnId}/tasks/{createTaskResponse!.TaskId}");
        responseFromDelete.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}