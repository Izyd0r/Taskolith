using System.Net.Http.Headers;
using System.Net.Http.Json;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Taskolith.API.Tasks.GetTasks;

namespace Taskolith.API.IntegrationTests.Tasks;

public class GetTasksTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Get_All_User_Tasks()
    {
        /*
        var client = _factory.CreateClient();
        var user = new User {
            Id = Guid.NewGuid(),
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
        
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginResponse?.Token);

        var firstRequest = new CreateTaskRequest("Title", "Description", DateTime.UtcNow.AddDays(3));
        var secondRequest = new CreateTaskRequest("New title", "New Description", DateTime.UtcNow.AddDays(3));
        
        var firstCreateTask = await client.PostAsJsonAsync("/api/tasks/", firstRequest);
        var secondCreateTask = await client.PostAsJsonAsync("/api/tasks/", secondRequest);
        
        var firstCreateTaskResponse = await firstCreateTask.Content.ReadFromJsonAsync<CreateTaskResponse>();
        var secondCreateTaskResponse = await secondCreateTask.Content.ReadFromJsonAsync<CreateTaskResponse>();
        
        firstCreateTask.EnsureSuccessStatusCode();
        secondCreateTask.EnsureSuccessStatusCode();
        
        var getTasksResponse = await client.GetAsync("/api/tasks/");
        getTasksResponse.EnsureSuccessStatusCode();
        var tasks = await getTasksResponse.Content.ReadFromJsonAsync<GetTasksResponse>();
        Assert.NotNull(tasks);
        Assert.NotEmpty(tasks.Tasks);
        var firstExists = tasks.Tasks.Any(t =>
            t.Title == firstCreateTaskResponse!.Title &&
            t.Description == firstCreateTaskResponse.Description &&
            t.DueDate <= firstCreateTaskResponse.DueDate.AddSeconds(2) &&
            t.DueDate >= firstCreateTaskResponse.DueDate.AddSeconds(-2) &&
            t.IsCompleted == firstCreateTaskResponse.Completed &&
            t.UserId == firstCreateTaskResponse.UserId &&
            t.Id == firstCreateTaskResponse!.TaskId
        );
        var secondExists = tasks.Tasks.Any(t =>
            t.Title == secondCreateTaskResponse!.Title &&
            t.Description == secondCreateTaskResponse.Description &&
            t.DueDate <= secondCreateTaskResponse.DueDate.AddSeconds(2) &&
            t.DueDate >= secondCreateTaskResponse.DueDate.AddSeconds(-2) &&
            t.IsCompleted == secondCreateTaskResponse.Completed &&
            t.UserId == secondCreateTaskResponse.UserId &&
            t.Id == secondCreateTaskResponse!.TaskId
        );
        Assert.True(firstExists);
        Assert.True(secondExists);
        */
    }

    [Fact]
    public async Task Should_Return_Empty_When_User_Have_Zero_Tasks()
    {
        var client = _factory.CreateClient();
        var user = new User {
            Id = Guid.NewGuid(),
            Username = "testusername2",
            Password = "PasswordExample123!",
            Email = "example2@email.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        DbContext.Users.Add(user);
        await DbContext.SaveChangesAsync();
        
        var loginRequest = new LoginRequest(user.Username, user.Password);
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginResponse?.Token);
        
        var getTasksResponse = await client.GetAsync("/api/tasks/");
        getTasksResponse.EnsureSuccessStatusCode();
        var tasks = await getTasksResponse.Content.ReadFromJsonAsync<GetTasksResponse>();
        Assert.NotNull(tasks);
        Assert.Empty(tasks.Tasks);
        Assert.Equal(tasks.UserId, user.Id);
    }
}