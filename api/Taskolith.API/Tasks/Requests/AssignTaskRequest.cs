namespace Taskolith.API.Tasks.Requests;

public record AssignTaskRequest(
    ICollection<Guid> MemberIds
);