using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.IntegrationTests.Tasks;

public class GetAssignedTasksForMemberTest(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Return_Tasks_Assigned_To_Member_Across_Multiple_Organisations() {
        var test = await BuildAuthorizedTest(_factory);
        var client = test.AuthorizedHttpClient;

        var org1 = await ApiHelper.CreateOrganisationAsync(client, "Test Organisation 1");
        var project1 = await ApiHelper.CreateProjectAsync(client, org1.OrganisationId, "Project Alpha");
        var column1 = await ApiHelper.CreateKanbanColumnAsync(client, org1.OrganisationId, project1.ProjectId, "To Do");

        var createTask1Request = new CreateTaskRequest("Task 1", "Assigned in Org 1", DateTime.UtcNow.AddDays(5), new List<Guid>(), 1, Priority.Critical);
        var task1Response = await client.PostAsJsonAsync($"/api/organisations/{org1.OrganisationId}/projects/{project1.ProjectId}/columns/{column1.KanbanColumnId}/tasks", createTask1Request);
        var task1Content = await task1Response.Content.ReadFromJsonAsync<CreateTaskResponse>();

        var createTask2Request = new CreateTaskRequest("Task 2", "Unassigned in Org 1", DateTime.UtcNow.AddDays(5), new List<Guid>(), 2, Priority.Critical);
        await client.PostAsJsonAsync($"/api/organisations/{org1.OrganisationId}/projects/{project1.ProjectId}/columns/{column1.KanbanColumnId}/tasks", createTask2Request);

        var memberIdOrg1 = DbContext.OrganisationMembers
            .Single(m => m.UserId == test.AuthorizedUser.Id && m.OrganisationId == org1.OrganisationId).Id;
        var assignTask1Request = new AssignTaskRequest(new List<Guid> { memberIdOrg1 });
        var assignResponse1 = await client.PutAsJsonAsync($"/api/organisations/{org1.OrganisationId}/projects/{project1.ProjectId}/tasks/{task1Content!.TaskId}/members", assignTask1Request);
        assignResponse1.EnsureSuccessStatusCode();

        var org2 = await ApiHelper.CreateOrganisationAsync(client, "Test Organisation 2");
        var project2 = await ApiHelper.CreateProjectAsync(client, org2.OrganisationId, "Project Beta");
        var column2 = await ApiHelper.CreateKanbanColumnAsync(client, org2.OrganisationId, project2.ProjectId, "In Progress");
        
        var createTask3Request = new CreateTaskRequest("Task 3", "Assigned in Org 2", DateTime.UtcNow.AddDays(10), new List<Guid>(), 1, Priority.Critical);
        var task3Response = await client.PostAsJsonAsync($"/api/organisations/{org2.OrganisationId}/projects/{project2.ProjectId}/columns/{column2.KanbanColumnId}/tasks", createTask3Request);
        var task3Content = await task3Response.Content.ReadFromJsonAsync<CreateTaskResponse>();
        
        var memberIdOrg2 = DbContext.OrganisationMembers
            .Single(m => m.UserId == test.AuthorizedUser.Id && m.OrganisationId == org2.OrganisationId).Id;
        var assignTask3Request = new AssignTaskRequest(new List<Guid> { memberIdOrg2 });
        var assignResponse2 = await client.PutAsJsonAsync($"/api/organisations/{org2.OrganisationId}/projects/{project2.ProjectId}/tasks/{task3Content!.TaskId}/members", assignTask3Request);
        assignResponse2.EnsureSuccessStatusCode();

        var response = await client.GetAsync("/api/tasks/my-tasks");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var assignedTasksResponse = await response.Content.ReadFromJsonAsync<GetAssignedTasksResponse>();

        assignedTasksResponse.Should().NotBeNull();
        var assignedTasks = assignedTasksResponse!.Tasks;
        
        assignedTasks.Should().NotBeNull();
        assignedTasks.Should().HaveCount(2, "because the user was assigned to one task in each of the two organisations");
        
        assignedTasks.Should().Contain(t => t.Task.TaskId == task1Content.TaskId && t.Organisation.OrganisationId == org1.OrganisationId, "Task 1 from Org 1 should be present");
        assignedTasks.Should().Contain(t => t.Task.TaskId == task3Content.TaskId && t.Organisation.OrganisationId == org2.OrganisationId, "Task 3 from Org 2 should be present");
    }
}