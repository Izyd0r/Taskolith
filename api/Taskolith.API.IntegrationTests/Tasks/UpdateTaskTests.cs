using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using FluentAssertions.Extensions;
using Microsoft.EntityFrameworkCore;
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
using Taskolith.API.Tasks.UpdateTask;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Tasks;

public class UpdateTaskTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;

    [Fact]
    public async Task Should_Update_Task_And_Return_NoContent() {
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
        var updateTaskRequest = new UpdateTaskRequest() {
            Title = "Updated Title",
            Description = "Updated Description",
            Priority = Priority.Critical,
            DueDate = DateTime.Parse("2025-08-01T12:00:00Z"),
            Order = 2,
            IsCompleted = false
        };
        var responseFromUpdate = await test.AuthorizedHttpClient.PutAsJsonAsync(
            $"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/{contentFromKanbanCreation!.KanbanColumnId}/tasks/{createTaskResponse.TaskId}",
            updateTaskRequest);
        responseFromUpdate.Content.Should().NotBeNull();
        _testOutputHelper.WriteLine(responseFromUpdate.Content.ReadAsStringAsync().Result);
        responseFromUpdate.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}