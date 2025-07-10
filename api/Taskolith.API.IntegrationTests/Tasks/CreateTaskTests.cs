using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;
using Taskolith.API.Tasks;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.Responses;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Tasks;

public class CreateTaskTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;
    
    [Fact]
    public async Task Should_Create_Task_And_Return_Created() {
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
        _testOutputHelper.WriteLine(responseFromCreateTask.Content.ReadAsStringAsync().Result);
        responseFromCreateTask.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createTaskResponse = await responseFromCreateTask.Content.ReadFromJsonAsync<CreateTaskResponse>();
        responseFromCreateTask.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/{contentFromKanbanCreation!.KanbanColumnId}/tasks/{createTaskResponse!.TaskId}");
        createTaskResponse.Should().NotBeNull();
        createTaskResponse.Title.Should().Be("Title");
        createTaskResponse.Description.Should().Be("Description");
        createTaskResponse.Priority.Should().Be(Priority.Critical);
    }
}