using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Taskolith.API.Data.Types;

namespace Taskolith.API.Auth;

public class JwtOptions
{
   public required string Key { get; init; }
   public required string Issuer { get; init; }
   public required string[] Audiences { get; init; }
   public required double ExpiryMinutes { get; init; }
}

public class JwtTokenGenerator(IOptions<JwtOptions> options)
{
   public string GenerateToken(User user)
   {
      var tokenHandler = new JwtSecurityTokenHandler();
      SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(options.Value.Key));

      var claims = new List<Claim>
      {
         new(ClaimTypes.NameIdentifier, user.Id.ToString()),
         new(ClaimTypes.Email, user.Email),
         new(ClaimTypes.Name, user.Username)
      };
      claims.AddRange(options.Value.Audiences.Select(x => new Claim(JwtRegisteredClaimNames.Aud, x)));

      var tokenDescription = new SecurityTokenDescriptor
      {
         Subject = new ClaimsIdentity(claims),
         Expires = DateTime.UtcNow.AddMinutes(options.Value.ExpiryMinutes),
         Issuer = options.Value.Issuer,
         SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
      };
      var token = tokenHandler.CreateToken(tokenDescription);
      return tokenHandler.WriteToken(token);
   }

   public static string GenerateRefreshToken()
   {
      var randomNumber = new byte[64];
      using var rng = RandomNumberGenerator.Create();
      rng.GetBytes(randomNumber);
      return Convert.ToBase64String(randomNumber);
   }
}