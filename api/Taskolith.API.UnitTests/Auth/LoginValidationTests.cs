using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Taskolith.API.Auth;
using Taskolith.API.Data.Types;

namespace Taskolith.API.UnitTests.Auth;

public class LoginValidationTests
{
   private const string Key = "ForTheLoveOfGodStoreAndLoadThisSecurely";

   [Fact]
   public void TokenGenerator_ShouldReturnCorrectToken_WithCorrectClaims()
   {
      // Arrange
      var user = new Data.Types.User {
         Id = Guid.NewGuid(),
         Username = "testusername",
         Password = "testpassword",
         Email = "example@email.com",
         FirstName = "Firstname",
         LastName = "Lastname"
      };
      
      var jwtOptions = Options.Create(new JwtOptions
      {
         Key = Key,
         Issuer = "TestIssuer",
         Audiences = ["TestAudience"],
         ExpiryMinutes = 60
      });
      
      var generator = new JwtTokenGenerator(jwtOptions);
      // Act
      
      var token = generator.GenerateToken(user);
      
      // Assert
      Assert.False(string.IsNullOrWhiteSpace(token));
      var handler = new JwtSecurityTokenHandler();
      var jwt = handler.ReadJwtToken(token);
      
      Assert.Equal(user.Id.ToString(), jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value);
      Assert.Equal("TestIssuer", jwt.Issuer);
      Assert.Contains("TestAudience", jwt.Audiences);
      Assert.True(jwt.ValidTo > DateTime.UtcNow);
   }

   [Fact]
   public void TokenGenerator_ShouldUseHmac256Algorithm_WithCorrectClaims()
   {
      // Arrange
      var user = new Data.Types.User {
         Id = Guid.NewGuid(),
         Username = "testusername",
         Password = "testpassword",
         Email = "example@email.com",
         FirstName = "Firstname",
         LastName = "Lastname"
      };
      
      var jwtOptions = Options.Create(new JwtOptions
      {
         Key = Key,
         Issuer = "TestIssuer",
         Audiences = ["TestAudience"],
         ExpiryMinutes = 60
      });
      
      var generator = new JwtTokenGenerator(jwtOptions);
      // Act
      
      var token = generator.GenerateToken(user);
      
      // Assert
      var handler = new JwtSecurityTokenHandler();
      var jwt = handler.ReadJwtToken(token);
      
      Assert.Equal(SecurityAlgorithms.HmacSha256, jwt.Header.Alg);
   }
}