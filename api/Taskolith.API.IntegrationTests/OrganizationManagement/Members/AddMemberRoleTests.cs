using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Members.Requests;
using Taskolith.API.OrganizationManagement.Members.Responses;
using Taskolith.API.OrganizationManagement.Organisations.CreateOrganisation;

namespace Taskolith.API.IntegrationTests.OrganizationManagement.Members;

public class AddMemberRoleTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Add_Role_To_A_Member_And_Should_Return_OK() {
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
        var responeFromAddingRole = await userOne.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles", requestRole);
        responeFromAddingRole.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await responeFromAddingRole.Content.ReadAsStringAsync();
        content.Should().NotBeNullOrEmpty();
        content.Should().Contain("Role added successfully");
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
        member!.Roles.Count().Should().Be(1);
        
        var responeFromAddingRole = await userTwo.AuthorizedHttpClient
            .PostAsJsonAsync($"/api/organisations/{responseContent!.OrganisationId}/members/{member!.Id}/roles", requestRole);
        responeFromAddingRole.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}