using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing; // Required for WebApplicationFactory
using Xunit;

// Note: If your test project is separate from your main API, it is standard 
// to name the namespace after the test project (e.g., checkInmate.Tests)
namespace checkInmate.Tests 
{
    // 1. We renamed the class from 'NewXUnit' to 'InmateApiTests'
    // 2. We attach the IClassFixture so xUnit boots up the background server exactly once
    public class InmateApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        // A private variable to hold our fake web browser
        private readonly HttpClient _client;

        // THE CONSTRUCTOR
        // xUnit passes the background web server (factory) into this class automatically
        public InmateApiTests(WebApplicationFactory<Program> factory)
        {
            // We tell the server to generate a client (browser) we can use to send HTTP requests
            _client = factory.CreateClient();
        }

        // The xUnit tag denoting an automated test
        [Fact]
        public async Task GetAllInmates_ReturnsHttp200Ok()
        {
            // ==========================================
            // ARRANGE: Set up the conditions
            // ==========================================
            // We specify the exact route we want our fake browser to hit
            string endpoint = "/api/Inmate";

            // ==========================================
            // ACT: Execute the code
            // ==========================================
            // We use the client to send a standard GET request to that endpoint
            var response = await _client.GetAsync(endpoint);

            // ==========================================
            // ASSERT: Verify the result
            // ==========================================
            // We check the response. If the API returns a 200 OK, this line passes.
            // If it returns a 404, 500, or anything else, the Assert crashes and the test fails.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}