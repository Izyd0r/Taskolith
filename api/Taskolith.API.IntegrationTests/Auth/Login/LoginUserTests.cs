using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Taskolith.API.Auth.Login;
using Taskolith.API.Data.Types;
using Xunit.Abstractions;

namespace Taskolith.API.IntegrationTests.Auth.Login;

public class LoginUserTests(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : BaseIntegrationTest(factory)
{
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;
    private readonly IntegrationTestWebAppFactory _factory = factory;
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();
    
    [Fact]
    public async Task LoginUser_ThatExists_ShouldReturnJWTAndSuccess()
    {
        var client = _factory.CreateClient();
        var user = new User {
            Username = "testusername",
            Password = "PasswordExample123!",
            Email = "example@email.com",
            FirstName = "Firstname",
            LastName = "Lastname"
        };
        var loginRequest = new LoginRequest(user.Username, user.Password);
        
        await DbContext.Users.AddAsync(user);
        await DbContext.SaveChangesAsync();
        
        var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseContent = await response.Content.ReadAsStringAsync();
        response.StatusCode.Should().Be(HttpStatusCode.OK, $"response content: {responseContent}");
        
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        loginResponse.Should().NotBeNull();
        loginResponse.Token.Should().NotBeNullOrEmpty();
        loginResponse.Username.Should().BeEquivalentTo(user.Username);
        
        var key = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audiences:0"];

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        var handler = new JwtSecurityTokenHandler();
        var principal = handler.ValidateToken(loginResponse.Token, validationParameters, out var validatedToken);

        var jwtToken = handler.ReadJwtToken(loginResponse.Token);

        foreach (var claim in jwtToken.Claims)
        {
            _testOutputHelper.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
        }
        
        var audienceClaims = principal.Claims
            .Where(c => c.Type == JwtRegisteredClaimNames.Aud)
            .Select(c => c.Value)
            .ToList();
        audienceClaims.Should().Contain(audience);
        
        var userIdClaim = principal.Claims
            .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        userIdClaim.Should().Be(user.Id.ToString());

        validatedToken.Issuer.Should().Be(issuer);
        validatedToken.ValidTo.Should().BeAfter(DateTime.UtcNow); 
    }
    
    [Theory]
    [InlineData("nonexistent@email.com", "CorrectPassword123!")]
    [InlineData("existinguser@email.com", "WrongPassword123!")]
    [InlineData("not-an-email", "SomePassword123!")]
    public async Task LoginUser_ThatDontExist_ShouldReturnUnauthorized(string email, string password)
    {
        // Arrange
        var invalidLoginRequest = new LoginRequest
        (
            email,
            password
        );
        var client = _factory.CreateClient();
        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", invalidLoginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
    
    [Theory]
    [InlineData("", "ValidPassword123!")]
    [InlineData("user@example.com", "")]
    [InlineData("", "")]
    public async Task Login_InvalidInput_ShouldReturnBadRequest(string email, string password)
    {
        var request = new LoginRequest ( email,password );
        var client = _factory.CreateClient();
        
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("' OR 1=1 --", "SomePassword123!")]
    [InlineData("existinguser@email.com", "' OR '1'='1")]
    public async Task LoginUser_ThatTriesSQLInject_ShouldReturnUnauthorized(string email, string password)
    {
        var request = new LoginRequest ( email,password );
        var client = _factory.CreateClient();
        
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized); 
    }
}