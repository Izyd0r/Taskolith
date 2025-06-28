using Taskolith.API.Auth;
using JwtTokenGenerator = Taskolith.API.Auth.JwtTokenGenerator;

namespace Taskolith.API.UnitTests.Auth.Tokens;

using Xunit;
using System;
using System.Collections.Generic;

public class TokenServiceTests
{
    [Fact]
    public void GenerateRefreshToken_ReturnsValidBase64String()
    {
        // Act
        var token = JwtTokenGenerator.GenerateRefreshToken(); 
        // Assert
        Assert.False(string.IsNullOrWhiteSpace(token));
        var buffer = Convert.FromBase64String(token);
        Assert.Equal(64, buffer.Length);
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnUniqueValues()
    {
        var tokens = new HashSet<string>();
        for (int i = 0; i < 10; i++)
        {
            tokens.Add(JwtTokenGenerator.GenerateRefreshToken());
        }
        Assert.Equal(10, tokens.Count);
    }
}
