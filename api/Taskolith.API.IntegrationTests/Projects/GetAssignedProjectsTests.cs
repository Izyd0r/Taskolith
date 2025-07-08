using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class GetAssignedProjectsTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;
    
    [Fact]
    public async Task Should_Return_All_Projects_That_Are_Assigned_To_A_Member_And_OK() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromPost = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var contentFromPost = await responseFromPost.Content.ReadFromJsonAsync<CreateProjectResponse>();
        var member = await DbContext.OrganisationMembers.FirstOrDefaultAsync(x => x.UserId == test.AuthorizedUser.Id);
        member.Should().NotBeNull();
        var project = await DbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == contentFromPost!.ProjectId);
        project.Should().NotBeNull();
        project.Members.Add(member);
        await DbContext.SaveChangesAsync();
        var responseFromGet = await test.AuthorizedHttpClient.GetAsync($"/api/organisations/{content?.OrganisationId}/projects/me");
        responseFromGet.StatusCode.Should().Be(HttpStatusCode.OK);
        var contentFromGet = await responseFromGet.Content.ReadFromJsonAsync<List<GetProjectsResponse>>();
        contentFromGet.Should().NotBeNull();
        contentFromGet.Should().HaveCount(1);
        contentFromGet[0].ProjectName.Should().Be(projectCreationRequest.Name);
        contentFromGet[0].ProjectDescription.Should().Be(projectCreationRequest.Description);
    } 
}