using System.Net.Http.Json;
using Taskolith.API.InviteSystem.Requests;
using Taskolith.API.InviteSystem.Responses;
using Taskolith.API.Kanban.Requests;
using Taskolith.API.Kanban.Responses;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.IntegrationTests;

public static class ApiHelper {
    public static async Task<CreateOrganisationResponse> CreateOrganisationAsync(HttpClient client, string name) {
        var request = new CreateOrganisationRequest(name);
        var response = await client.PostAsJsonAsync("/api/organisations", request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CreateOrganisationResponse>())!;
    }

    public static async Task<CreateProjectResponse> CreateProjectAsync(HttpClient client, Guid organisationId, string name, string description = "Default test description") {
        var request = new CreateProjectRequest(name, description);
        var response = await client.PostAsJsonAsync($"/api/organisations/{organisationId}/projects", request);

        if (response.IsSuccessStatusCode) return (await response.Content.ReadFromJsonAsync<CreateProjectResponse>())!;
        var error = await response.Content.ReadAsStringAsync();
        throw new Exception($"Failed to create project. Status: {response.StatusCode}. Error: {error}");
    }

    public static async Task<CreateKanbanColumnResponse> CreateKanbanColumnAsync(HttpClient client, Guid organisationId, Guid projectId, string name) {
        var request = new CreateKanbanColumnRequest(name);
        var response = await client.PostAsJsonAsync($"/api/organisations/{organisationId}/projects/{projectId}/columns", request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CreateKanbanColumnResponse>())!;
    }

    public static async Task<Guid> InviteUserToOrganisationAsync(HttpClient adminClient, Guid organisationId, string userEmail) {
        var request = new InviteMemberRequest(userEmail, DateTime.UtcNow.AddDays(7));
        var response = await adminClient.PostAsJsonAsync($"/api/organisations/{organisationId}/invitations", request);
    
        response.EnsureSuccessStatusCode();
    
        var inviteResponse = await response.Content.ReadFromJsonAsync<InviteMemberResponse>();
        return inviteResponse!.InviteId;
    }
    
    public static async Task AcceptOrganisationInviteAsync(HttpClient userClient, Guid inviteId) {
        var response = await userClient.PostAsync($"/api/invitations/{inviteId}/accept", null);
        response.EnsureSuccessStatusCode();
    }
    
    public static async Task AssignMembersToProjectAsync(HttpClient adminClient, Guid organisationId, Guid projectId, List<Guid> organisationMemberIds) {
        var request = new AssignProjectRequest(organisationMemberIds);
        var response = await adminClient.PostAsJsonAsync($"/api/organisations/{organisationId}/projects/{projectId}/members", request);
        response.EnsureSuccessStatusCode();
    }
}