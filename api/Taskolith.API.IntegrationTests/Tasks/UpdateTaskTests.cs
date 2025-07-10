using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using FluentAssertions.Extensions;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Taskolith.API.Tasks.Requests;
using Taskolith.API.Tasks.UpdateTask;

namespace Taskolith.API.IntegrationTests.Tasks;

public class UpdateTaskTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task Should_Update_Task()
    {/*
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
        var responseFromCreateTask = await client.PostAsJsonAsync("/api/tasks/", createTaskRequest);
        responseFromCreateTask.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var createTaskResponse = await responseFromCreateTask.Content.ReadFromJsonAsync<CreateTaskResponse>();
        responseFromCreateTask.Headers.Location?.OriginalString.Should().Be($"/api/tasks/{createTaskResponse!.TaskId}");
        
        var updateTaskRequest = new UpdateTaskRequest(createTaskResponse!.TaskId, "New title", "New description", DateTime.UtcNow.AddDays(1), createTaskResponse.Completed);
        var responseFromUpdateTask = await client.PutAsJsonAsync("/api/tasks/", updateTaskRequest);
        responseFromUpdateTask.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var updatedTask = await DbContext.ToDoTasks.SingleAsync(x => x.Id == updateTaskRequest.TaskId);
        updatedTask!.Title.Should().Be(updateTaskRequest.Title);
        updatedTask.Description.Should().Be(updateTaskRequest.Description);
        updatedTask.DueDate.Should().BeCloseTo(updateTaskRequest.DueDate!.Value,2.Seconds());
        updatedTask.IsCompleted.Should().BeFalse();*/
    }
    
    [Fact]
    public async Task Should_Return_Bad_Request_When_Task_Doesnt_Exist()
    {/*
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

        var updateTaskRequest = new UpdateTaskRequest(Guid.NewGuid(), "New title", "New description", DateTime.UtcNow.AddDays(1), true);
        var responseFromUpdateTask = await client.PutAsJsonAsync("/api/tasks/", updateTaskRequest);
        responseFromUpdateTask.StatusCode.Should().Be(HttpStatusCode.BadRequest, "No task found");*/
    }
}