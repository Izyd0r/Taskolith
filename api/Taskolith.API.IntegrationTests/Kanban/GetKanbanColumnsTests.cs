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

public class GetKanbanColumnsTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task GetKanbanColumns_WhenColumnsExist_ShouldReturnAllColumnsInProject() {
        var authContext = await BuildAuthorizedTest(_factory);
        var client = authContext.AuthorizedHttpClient;

        var organisation = await ApiHelper.CreateOrganisationAsync(client, "Test Organisation");
        var project = await ApiHelper.CreateProjectAsync(client, organisation.OrganisationId, "My Awesome Project");
        var createdColumn1 = await ApiHelper.CreateKanbanColumnAsync(client, organisation.OrganisationId, project.ProjectId, "To Do");
        var createdColumn2 = await ApiHelper.CreateKanbanColumnAsync(client, organisation.OrganisationId, project.ProjectId, "Done");

        var response = await client.GetAsync($"/api/organisations/{organisation.OrganisationId}/projects/{project.ProjectId}/columns");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var returnedColumns = await response.Content.ReadFromJsonAsync<List<GetKanbanColumnResponse>>();

        returnedColumns.Should().NotBeNull();
        returnedColumns.Should().HaveCount(2);
        returnedColumns.Should().Contain(c => c.ColumnId == createdColumn1.KanbanColumnId);
        returnedColumns.Should().Contain(c => c.ColumnId == createdColumn2.KanbanColumnId);
    }

    [Fact]
    public async Task GetKanbanColumns_WhenUserIsOrgMemberButNotProjectMember_ShouldReturnForbidden() {
        var projectOwnerContext = await AuthorizedIntegrationTest.BuildAuthorizedTest(_factory);
        var projectOwnerClient = projectOwnerContext.AuthorizedHttpClient;

        var orgMemberContext = await AuthorizedIntegrationTest.BuildAuthorizedTest(_factory);

        var organisation = await ApiHelper.CreateOrganisationAsync(projectOwnerClient, "Project-Scoped Org");

        var inviteId = await ApiHelper.InviteUserToOrganisationAsync(projectOwnerClient, organisation.OrganisationId, orgMemberContext.AuthorizedUser.Email);
        await ApiHelper.AcceptOrganisationInviteAsync(orgMemberContext.AuthorizedHttpClient, inviteId);

        var project = await ApiHelper.CreateProjectAsync(projectOwnerClient, organisation.OrganisationId, "A Private Project");
        await ApiHelper.CreateKanbanColumnAsync(projectOwnerClient, organisation.OrganisationId, project.ProjectId, "Secret Column");

        var response = await orgMemberContext.AuthorizedHttpClient.GetAsync($"/api/organisations/{organisation.OrganisationId}/projects/{project.ProjectId}/columns");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}