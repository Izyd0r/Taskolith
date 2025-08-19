using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class GetMembersInsideProjectTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Return_All_Members_That_Are_Assigned_To_A_Project() {
        var admin = await BuildAuthorizedTest(_factory);

        var createOrgRequest = new CreateOrganisationRequest("Organisation");
        var orgResponse = await admin.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrgRequest);
        var org = await orgResponse.Content.ReadFromJsonAsync<CreateOrganisationResponse>();

        var createProjectRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var projectResponse = await admin.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{org!.OrganisationId}/projects", createProjectRequest);
        var project = await projectResponse.Content.ReadFromJsonAsync<CreateProjectResponse>();

        var member = await DbContext.OrganisationMembers.FirstOrDefaultAsync(m =>
            m.UserId == admin.AuthorizedUser.Id &&
            m.OrganisationId == org.OrganisationId);

        var assignRequest = new AssignProjectRequest([member!.Id]);
        var assignResponse = await admin.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{org.OrganisationId}/projects/{project!.ProjectId}/members", assignRequest);

        assignResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getMembersResponse = await admin.AuthorizedHttpClient
            .GetAsync($"/api/organisations/{org.OrganisationId}/projects/{project.ProjectId}/members");
        var membersResult = await getMembersResponse.Content.ReadFromJsonAsync<GetMembersInsideProjectReponse>();

        membersResult.Should().NotBeNull();
        membersResult!.Members.Count.Should().Be(1);
    }
}