using Microsoft.EntityFrameworkCore;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<ToDoTask> ToDoTasks { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUsersTable(modelBuilder);
        ConfigureTasksTable(modelBuilder);
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

    private static void ConfigureTasksTable(ModelBuilder modelBuilder)
    {
        var builder = modelBuilder.Entity<ToDoTask>();

        builder.ToTable("ToDoTasks");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(256);
        builder.Property(t => t.Description).IsRequired().HasMaxLength(1024);
        builder.Property(t => t.DueDate).IsRequired();
        builder.Property(t => t.CreatedDate).IsRequired();
        builder.HasOne<User>()
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
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
}