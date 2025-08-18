using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data.Types;
using Taskolith.API.Members.Requests;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Members;

public class RemoveMemberRoleTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : AuthorizedIntegrationTest(factory) {
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Remove_Role_From_A_Member_And_Should_Return_NoContent() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var role = new Role {
            Id = Guid.NewGuid(),
            OrganisationId = responseContent!.OrganisationId,
            Name = "Super Member",
            Permissions = Permission.CreateRole
        };
        DbContext.Roles.Add(role);
        await DbContext.SaveChangesAsync();
        var requestRole = new AddMemberRoleRequest(role.Id);
        var member = DbContext.OrganisationMembers.Include(membership => membership.Roles).FirstOrDefault(m => m.UserId == userOne.AuthorizedUser.Id && m.OrganisationId == role.OrganisationId);
        member!.Roles.Count().Should().Be(1);
        member!.Roles.First().Name.Should().Be("Admin");
        await userOne.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles", requestRole);

        var responeFromRemovingRole = await userOne.AuthorizedHttpClient.DeleteAsync(
            $"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles/{role.Id}");
        var content = await responeFromRemovingRole.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(content);
        responeFromRemovingRole.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
    
    [Fact]
    public async Task Should_Return_Not_Found_When_Member_Dont_Have_A_Role() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var member = DbContext.OrganisationMembers.Include(membership => membership.Roles)
            .FirstOrDefault(m => m.UserId == userOne.AuthorizedUser.Id);
        
        var responeFromRemovingRole = await userOne.AuthorizedHttpClient.DeleteAsync(
            $"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles/{Guid.NewGuid()}");
        responeFromRemovingRole.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task Outside_User_Cant_Add_Role_To_A_Member_And_Should_Return_Forbidden() {
        var userOne = await BuildAuthorizedTest(_factory);
        var request = new CreateOrganisationRequest("Organisation");
        var response = await userOne.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", request);
        var responseContent = await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>();
        var userTwo = await BuildAuthorizedTest(_factory);
       
        var role = new Role {
            Id = Guid.NewGuid(),
            OrganisationId = responseContent!.OrganisationId,
            Name = "Super Member",
            Permissions = Permission.CreateRole
        };
        DbContext.Roles.Add(role);
        await DbContext.SaveChangesAsync();
        var requestRole = new AddMemberRoleRequest(role.Id);
        var member = DbContext.OrganisationMembers.Include(membership => membership.Roles).FirstOrDefault(m => m.UserId == userOne.AuthorizedUser.Id && m.OrganisationId == role.OrganisationId);
        await userOne.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles", requestRole);
        
        var responeFromRemovingRole = await userTwo.AuthorizedHttpClient.DeleteAsync(
            $"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles/{role.Id}");
        responeFromRemovingRole.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}