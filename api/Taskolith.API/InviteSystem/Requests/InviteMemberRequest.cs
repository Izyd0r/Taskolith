namespace Taskolith.API.InviteSystem.Requests;

public record InviteMemberRequest(
    string Email,
    DateTime DueDate
);