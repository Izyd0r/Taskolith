using Taskolith.API.Data.Types;

namespace Taskolith.API.Tasks.Requests;

public record CreateTaskRequest (
    string Title,
    string Description,
    DateTime DueDate,
    ICollection<Guid> AssignedMembers,
    int Order,
    Priority Priority
);