using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Taskolith.API.Organisations.Requests;
using Taskolith.API.Organisations.Responses;

namespace Taskolith.API.IntegrationTests.Organisations;

public class GetUserOrganisationsTests(IntegrationTestWebAppFactory factory) : AuthorizedIntegrationTest(factory) {
    private readonly IntegrationTestWebAppFactory _factory = factory;

    [Fact]
    public async Task User_Should_Get_All_Organisations_He_Is_In() {
        var user = await BuildAuthorizedTest(_factory);
        var createOrganisationRequest = new CreateOrganisationRequest("Organisation");
        await user.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrganisationRequest);
        await user.AuthorizedHttpClient.PostAsJsonAsync("/api/organisations", createOrganisationRequest);
        var responseFromGet = await user.AuthorizedHttpClient.GetAsync("/api/organisations/user");
        responseFromGet.Should().NotBeNull();
        responseFromGet.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await responseFromGet.Content.ReadFromJsonAsync<List<GetUserOrganisationsResponse>>();
        content!.Count().Should().Be(2);
        content![0].OrganisationName.Should().Be("Organisation");
        content![1].OrganisationName.Should().Be("Organisation");
    }
    
}