using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Taskolith.API.Tasks.CreateTask;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Tasks;

public class DeleteTaskTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : BaseIntegrationTest(factory)
{
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Delete_Task_That_Exists()
    {
        var client = _factory.CreateClient();
        var user = new User {
            Username = "testusername",
            Password = "PasswordExample123!",
            Email = "example@email.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        DbContext.Users.Add(user);
        await DbContext.SaveChangesAsync();
        
        var loginRequest = new LoginRequest(user.Username, user.Password);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginResponse?.Token);
        
        var createTaskRequest = new CreateTaskRequest("Title", "Description", DateTime.UtcNow.AddDays(1));
        var createResponse = await client.PostAsJsonAsync("/api/tasks/create-task", createTaskRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var created = await createResponse.Content.ReadFromJsonAsync<CreateTaskResponse>();
        created.Should().NotBeNull();
        var taskId = created!.TaskId;
        
        var deleteResponse = await client.DeleteAsync($"/api/tasks/{taskId}");
        var responseBody = await deleteResponse.Content.ReadAsStringAsync();

        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent, $"Response: {responseBody}");
        responseBody.Should().BeNullOrEmpty();
    }
    
    [Fact]
    public async Task Should_Return_NotFound_When_Task_Dont_Exist()
    {
        var client = _factory.CreateClient();
        var user = new User {
            Username = "testusername",
            Password = "PasswordExample123!",
            Email = "example@email.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        DbContext.Users.Add(user);
        await DbContext.SaveChangesAsync();
        
        var loginRequest = new LoginRequest(user.Username, user.Password);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginResponse?.Token);

        var deleteResponse = await client.DeleteAsync($"/api/tasks/{Guid.NewGuid()}");
        var responseBody = await deleteResponse.Content.ReadAsStringAsync();

        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NotFound, $"Response: {responseBody}");
        responseBody.Should().BeNullOrEmpty();
    } 
}