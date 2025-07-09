using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class RemoveFromProjectTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Remove_Member_From_Project_And_Return_NoContent() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var contentProject = await responseFromProjectCreation.Content.ReadFromJsonAsync<CreateProjectResponse>();
        var member = await DbContext.OrganisationMembers.FirstOrDefaultAsync(m =>
            m.UserId == test.AuthorizedUser.Id && content!.OrganisationId == m.OrganisationId);
        var assignRequest = new AssignProjectRequest([member!.Id]);
        await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/members", assignRequest);
        var responseFromUnassign = await test.AuthorizedHttpClient.DeleteAsync($"/api/organisations/{content?.OrganisationId}/projects/{contentProject!.ProjectId}/members/{member!.Id}");
        responseFromUnassign.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}