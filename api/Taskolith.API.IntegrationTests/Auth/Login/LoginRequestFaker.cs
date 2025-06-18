using Bogus;
using Taskolith.API.Auth.Login;

namespace Taskolith.API.IntegrationTests.Auth.Login;

public class LoginRequestFaker : Faker<LoginRequest>
{
    public LoginRequestFaker()
    {
        CustomInstantiator(f => new LoginRequest(
            Username: f.Person.UserName,
            Password: f.Internet.Password(12, prefix: "P@ss1")
        ));
    }

}