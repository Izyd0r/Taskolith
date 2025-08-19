using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.IntegrationTests.Tasks;

public class GetAssignedMemberToTaskTest(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task Should_Return_Assigned_Member_To_Task() {
        var test = await BuildAuthorizedTest(_factory);

        var createOrgRequest = new CreateOrganisationRequest("Organisation");
        var orgResponse = await test.AuthorizedHttpClient
            .PostAsJsonAsync("/api/organisations", createOrgRequest);
        var orgContent = await orgResponse.Content.ReadFromJsonAsync<CreateOrganisationResponse>();

        var createProjectRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var projectResponse = await test.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{orgContent!.OrganisationId}/projects", createProjectRequest);
        var projectContent = await projectResponse.Content.ReadFromJsonAsync<CreateProjectResponse>();

        var createColumnRequest = new CreateKanbanColumnRequest("ToDo");
        var columnResponse = await test.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{orgContent.OrganisationId}/projects/{projectContent!.ProjectId}/columns", createColumnRequest);
        var columnContent = await columnResponse.Content.ReadFromJsonAsync<CreateKanbanColumnResponse>();

        var createTaskRequest = new CreateTaskRequest(
            "Title", 
            "Description", 
            DateTime.UtcNow.AddDays(7), 
            new List<Guid>(), 
            1, 
            Priority.Critical
        );
        var taskResponse = await test.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{orgContent.OrganisationId}/projects/{projectContent.ProjectId}/columns/{columnContent!.KanbanColumnId}/tasks", createTaskRequest);
        var taskContent = await taskResponse.Content.ReadFromJsonAsync<CreateTaskResponse>();

        var memberId = DbContext.OrganisationMembers
            .First(m => m.UserId == test.AuthorizedUser.Id).Id;
        var assignRequest = new AssignTaskRequest(new List<Guid> { memberId });
        var assignResponse = await test.AuthorizedHttpClient
            .PutAsJsonAsync($"/api/organisations/{orgContent.OrganisationId}/projects/{projectContent.ProjectId}/tasks/{taskContent!.TaskId}/members", assignRequest);
        assignResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getMembersResponse = await test.AuthorizedHttpClient
            .GetAsync($"/api/organisations/{orgContent.OrganisationId}/projects/{projectContent.ProjectId}/tasks/{taskContent.TaskId}/members");

        getMembersResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var assignedMembers = await getMembersResponse.Content.ReadFromJsonAsync<GetAssignedMembersToTaskResponse>();
        assignedMembers.Should().NotBeNull();
        assignedMembers!.Members.Should().NotBeNull();
        assignedMembers.Members.Should().HaveCount(1);
    }
}