namespace Taskolith.API.Common;

public interface IEndPoint
{
    static abstract void Map(IEndpointRouteBuilder app);
}