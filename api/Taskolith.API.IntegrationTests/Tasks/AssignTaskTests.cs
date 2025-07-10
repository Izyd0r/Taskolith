using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data.Types;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.IntegrationTests.Tasks;

public class AssignTaskTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Assign_Task_To_A_Member_And_Return_NoContent() {
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

        var assignRequest = new AssignTaskRequest([DbContext.OrganisationMembers.FirstOrDefault(m => m.UserId == test.AuthorizedUser.Id)!.Id]);
        var responseFromAssign = await test.AuthorizedHttpClient.PutAsJsonAsync(
            $"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/tasks/{createTaskResponse!.TaskId}/members",
            assignRequest);
        responseFromAssign.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}