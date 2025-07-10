using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class CreateProjectTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Create_Project_Inside_An_Organisation_And_Return_Created() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        responseFromProjectCreation.Should().NotBeNull();
        responseFromProjectCreation.StatusCode.Should().Be(HttpStatusCode.Created);
        var contentProject = await responseFromProjectCreation.Content.ReadFromJsonAsync<CreateProjectResponse>();
        responseFromProjectCreation.Headers.Location?.OriginalString.Should().Be($"/api/organisations/{content?.OrganisationId}/projects/{contentProject?.ProjectId}");
        contentProject.Should().NotBeNull();
        var entity = await DbContext.Projects.FindAsync(contentProject.ProjectId);
        contentProject.ProjectId.Should().Be(entity!.Id);
    }

    [Fact]
    public async Task Member_Without_Permissions_Should_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var member = new Membership() {
            Id = Guid.NewGuid(),
            OrganisationId = content.OrganisationId,
            UserId = userTwo.AuthorizedUser.Id,
            User = userTwo.AuthorizedUser,
        };
        DbContext.OrganisationMembers.Add(member);
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await userTwo.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        responseFromProjectCreation.Should().NotBeNull();
        responseFromProjectCreation.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Fact]
    public async Task Outside_User_Should_Not_Be_Able_To_Create_Project_And_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        var responseFromProjectCreation = await userTwo.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        responseFromProjectCreation.Should().NotBeNull();
        responseFromProjectCreation.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}