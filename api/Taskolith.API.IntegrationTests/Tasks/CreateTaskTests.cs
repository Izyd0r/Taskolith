using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Taskolith.API.Tasks.CreateTask;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Tasks;

public class CreateTaskTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : BaseIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;

    [Fact]
    public async Task ShouldCreateTask_WithValidInput()
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

        var createTaskRequest = new CreateTaskRequest("Title", "Description", DateTime.UtcNow);
        var responseFromCreateTask = await client.PostAsJsonAsync("/api/tasks/createtask", createTaskRequest);
        responseFromCreateTask.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createTaskResponse = await responseFromCreateTask.Content.ReadFromJsonAsync<CreateTaskResponse>();
        responseFromCreateTask.Headers.Location?.OriginalString.Should().Be($"/api/tasks/{createTaskResponse!.TaskId}");
    }
}