using Bogus;
using Taskolith.API.Auth;
using Taskolith.API.Auth.SignUp;

namespace Taskolith.API.IntegrationTests.Auth;

public sealed class SignUpRequestFaker : Faker<SignUpRequest>
{
    public SignUpRequestFaker()
    {
        CustomInstantiator(f => new SignUpRequest(
            Username: f.Person.UserName,
            Email: f.Person.Email,
            Password: f.Internet.Password(12, prefix: "P@ss1"),
            FirstName: f.Person.FirstName,
            LastName: f.Person.LastName
        ));
    }
}