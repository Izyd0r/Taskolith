using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Organisations.Requests;
using Taskolith.API.OrganizationManagement.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests.Projects;

public class GetProjectsTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Return_One_Project_And_OK() {
        var test = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await test.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        await test.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var responseFromGet = await test.AuthorizedHttpClient.GetAsync($"/api/organisations/{content?.OrganisationId}/projects");
        responseFromGet.StatusCode.Should().Be(HttpStatusCode.OK);
        var contentFromGet = await responseFromGet.Content.ReadFromJsonAsync<List<GetProjectsResponse>>();
        contentFromGet.Should().NotBeNull();
        contentFromGet.Should().HaveCount(1);
        contentFromGet[0].ProjectName.Should().Be(projectCreationRequest.Name);
        contentFromGet[0].ProjectDescription.Should().Be(projectCreationRequest.Description);
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
            UserId = userTwo.AuthorizedUser.Id
        };
        DbContext.OrganisationMembers.Add(member);
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var responseFromGet = await userTwo.AuthorizedHttpClient.GetAsync($"/api/organisations/{content?.OrganisationId}/projects");
        responseFromGet.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Fact]
    public async Task Outside_User_Should_Not_Be_Able_To_Create_Project_And_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var userTwo = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var projectCreationRequest = new CreateProjectRequest("Backend API", "Project for XYZ firm");
        await userOne.AuthorizedHttpClient.PostAsJsonAsync($"/api/organisations/{content?.OrganisationId}/projects", projectCreationRequest);
        var responseFromGet = await userTwo.AuthorizedHttpClient.GetAsync($"/api/organisations/{content?.OrganisationId}/projects");
        responseFromGet.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task If_No_Projects_Should_Return_Empty_List() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var content = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var responseFromGet = await userOne.AuthorizedHttpClient.GetAsync($"/api/organisations/{content?.OrganisationId}/projects");
        responseFromGet.StatusCode.Should().Be(HttpStatusCode.OK);
        var contentFromGet = await responseFromGet.Content.ReadFromJsonAsync<List<GetProjectsResponse>>();
        contentFromGet.Should().NotBeNull();
        contentFromGet.Should().HaveCount(0);
    }
}