using System.Text;
using Microsoft.EntityFrameworkCore;
using Taskolith.API;
using Taskolith.API.Data;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Taskolith.API.Auth;
using Taskolith.API.Data.Types;

const string WebAppCorsPolicy = "_webAppCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: WebAppCorsPolicy,
                      policy =>
                      {
                            // This still needs to change
                            policy.SetIsOriginAllowed(origin =>
                            {
                                if (string.IsNullOrWhiteSpace(origin)) return false;
                                var uri = new Uri(origin);
                                return (uri.Host == "localhost" || uri.Host.StartsWith("172."))
                                && (uri.Port == 5173 || uri.Port == 5174 || uri.Port == 5175);
                            })
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                      });
});
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Taskolith API",
        Description = "An API for Taskolith"
    });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header using the Bearer scheme.",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    
    options.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, new List<string>() }
    });
});
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudiences = [
                builder.Configuration["Jwt:Audiences:0"]
            ],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                )
        };
    });
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuthorizationHandler, PermissionHandler>();
builder.Services.AddScoped<PermissionService>();
builder.Services.AddAuthorization(options => {
    foreach (var permission in Enum.GetValues<Permission>()) {
        options.AddPolicy(permission.ToString(), policy => policy.Requirements.Add(new PermissionRequirement(permission)));
    }
});
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddTransient<JwtTokenGenerator>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}
app.UseRouting();
app.UseCors(WebAppCorsPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapEndpoints();

using var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await context.Database.EnsureCreatedAsync();

app.Run();

public partial class Program { }
