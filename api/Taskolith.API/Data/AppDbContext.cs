using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<ToDoTask> ToDoTasks { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Organisation> Organisations { get; set; }
    public DbSet<Membership> OrganisationMembers { get; set; }
    public DbSet<Invitation> Invitations { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Project> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUsersTable(modelBuilder);
        ConfigureOrganizationsTable(modelBuilder);
        ConfigureOrganizationMembersTable(modelBuilder);
        ConfigureRolesTable(modelBuilder);
        ConfigureInvitationsTable(modelBuilder);
        ConfigureTasksTable(modelBuilder);
        ConfigureProjectsTable(modelBuilder);
        ConfigureUsersRefreshTokensTable(modelBuilder);
        base.OnModelCreating(modelBuilder);
    }

    private static void ConfigureUsersTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<User>();
        
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.Password).IsRequired().HasMaxLength(100);
        builder.Property(u=> u.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.LastName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Username).IsRequired().HasMaxLength(20);
        builder.HasIndex(u => u.Username).IsUnique();
    }

    private static void ConfigureOrganizationsTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Organisation>();
        
        builder.ToTable("Organizations");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Name).IsRequired().HasMaxLength(200);
        builder.HasMany(o => o.OrganisationRoles)
            .WithOne(o => o.Organisation)
            .HasForeignKey(o => o.OrganisationId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(o => o.Members)
            .WithOne(o => o.Organisation)
            .HasForeignKey(o => o.OrganisationId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureRolesTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Role>();
        
        builder.ToTable("Roles");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(200);
        builder.HasOne(r => r.Organisation)
            .WithMany(r => r.OrganisationRoles)
            .HasForeignKey(r => r.OrganisationId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(r => r.Members)
            .WithMany(r => r.Roles);
    }

    private static void ConfigureOrganizationMembersTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Membership>();
        
        builder.ToTable("OrganizationMembers");
        builder.HasKey(o => o.Id);
        builder.HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Organisation)
            .WithMany(o => o.Members)
            .HasForeignKey(m => m.OrganisationId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureInvitationsTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<Invitation>();
        
        builder.ToTable("Invitations");
        builder.HasKey(i => i.Id);
        builder.HasOne(i => i.Organisation)
            .WithMany()
            .HasForeignKey(i => i.OrganisationId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(i => i.User)
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Property(i => i.Status)
            .HasConversion<string>()
            .HasDefaultValue(InvitationStatus.Pending)
            .IsRequired();
        builder.Property(i => i.DueDate)
            .IsRequired();
    }
    
    private static void ConfigureTasksTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<ToDoTask>();

        builder.ToTable("ToDoTasks");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(256);
        builder.Property(t => t.Description).IsRequired().HasMaxLength(1024);
        builder.Property(t => t.DueDate).IsRequired();
        builder.Property(t => t.CreatedDate).IsRequired();
        builder.HasMany(t => t.Members)
            .WithMany(m => m.Tasks);
    }

    private static void ConfigureUsersRefreshTokensTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<RefreshToken>();
        
        builder.ToTable("UserRefreshTokens");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Token).IsRequired().HasMaxLength(256);
        builder.Property(t => t.IsActive).IsRequired();
        builder.Property(t => t.Created).IsRequired();
        builder.Property(t => t.Expires).IsRequired();
        builder.HasOne<User>()
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureProjectsTable(ModelBuilder modelBuilder) { 
        var builder = modelBuilder.Entity<Project>();
        
        builder.ToTable("Projects");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Name).IsRequired().HasMaxLength(50);
        builder.Property(t => t.Description).IsRequired().HasMaxLength(100);
        builder.HasMany(p => p.Members)
            .WithMany(p => p.Projects);
        builder.HasMany(p => p.Tasks)
           .WithOne(p => p.Project)
           .HasForeignKey(t => t.ProjectId)
           .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(p => p.Organisation)
           .WithMany(o => o.Projects);
    }
}