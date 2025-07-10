using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth.Login;
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

public class GetTasksTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Get_All_Tasks_Assigned_To_A_Member_And_Return_Ok() {
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

        var member = await DbContext.OrganisationMembers.FirstOrDefaultAsync(m => m.UserId == test.AuthorizedUser.Id);
        
        var createTaskRequest = new CreateTaskRequest("Title", "Description", DateTime.UtcNow.AddDays(7), [member!.Id], 1, Priority.Critical);
        await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/columns/{contentFromKanbanCreation!.KanbanColumnId}/tasks", createTaskRequest);
        
        var getTaskResponse = await test.AuthorizedHttpClient.GetAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/tasks");
        getTaskResponse.EnsureSuccessStatusCode();
        var contentFromGetTask = await getTaskResponse.Content.ReadFromJsonAsync<GetTasksResponse>();
        contentFromGetTask!.Tasks.Count().Should().Be(1);
        contentFromGetTask!.Tasks.First().Title.Should().Be("Title");
        contentFromGetTask!.Tasks.First().Description.Should().Be("Description");
    }
}