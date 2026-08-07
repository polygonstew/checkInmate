# Devlog for checkInmate
## false start 

* `dotnet new webapi -n checkInmate -o checkInmate`

### right off the bat I get an error
* warning NU1903: Package 'Microsoft.OpenApi' 2.0.0 has a known high severity vulnerability, https://github.com/advisories/GHSA-v5pm-xwqc-g5wc

I know it is a caution error, but still want to fix it if I can through a simple terminal command.
* `dotnet add package Microsoft.OpenApi` <----- Fixes it. UPDATE: It does not fix it. Nearly posted it to Slack :(

Nope, broke it. Now I have 2 serious red errors. 
  checkInmate net10.0 failed with 2 error(s) (11.0s)
    C:\2026\capStone\checkInmate\checkInmate\obj\Debug\net10.0\Microsoft.AspNetCore.OpenApi.SourceGenerators\Microsoft.AspNetCore.OpenApi.SourceGenerators.XmlCommentGenerator\OpenApiXmlCommentSupport.generated.cs(399,41): error CS0200: Property or indexer 'IOpenApiMediaType.Example' cannot be assigned to -- it is read only
    C:\2026\capStone\checkInmate\checkInmate\obj\Debug\net10.0\Microsoft.AspNetCore.OpenApi.SourceGenerators\Microsoft.AspNetCore.OpenApi.SourceGenerators.XmlCommentGenerator\OpenApiXmlCommentSupport.generated.cs(461,41): error CS0200: Property or indexer 'IOpenApiMediaType.Example' cannot be assigned to -- it is read only

*? hmmm. I wonder if it's an admin problem. restarting in admin. BACK: no it wasn't an admin issue.

ok so CS0200. "checkInmate\obj\Debug\net10.0\Microsoft.AspNetCore.OpenApi.SourceGenerators\Microsoft.AspNetCore.OpenApi.SourceGenerators.XmlCommentGenerator\OpenApiXmlCommentSupport.generated.cs" (461,41)

wow, it messed it up because I mixed and matched with versions. so now I am removing it and updating ASPNet
* dotnet remove package Microsoft.OpenApi
* dotnet add package Microsoft.AspNetCore.OpenApi

welp, right back to the beginning. still throwing the same NU1903 error from earlier. I know I can start building the API, but getting rid of these yellow colors that grabs the eye would be nice. I feel like I may be digging a hole though.

HA! I just remove the warning visually. Seems cheap, but in my csproj I add this line to the Property 
    <!--- doesn't have a simple fix , supressing -->
    <NoWarn>$(NoWarn);NU1903</NoWarn>

    * Beleive it or not the link it gives to the github advisory explains. 
      https://github.com/advisories/GHSA-v5pm-xwqc-g5wc

# Starting
## it begins

to kick it off I want to add landing page so users don't get confuse when following the link when running.
"localhost:5197"

cleaning up the program cs file so I can start buidling on top of the given structure/boilerplate

* build/run
had a little bit of trouble but fixed it, typo

note: (- app.MapGet is very useful -)  

decided to layout the site a bit using the following commands

! ERROR: warn: Microsoft.AspNetCore.HttpsPolicy.HttpsRedirectionMiddleware[3]
      Failed to determine the https port for redirect.

throws this a run point, i think it's a security deal with https. that is above my current pay grade. will be back to see if I can remove it.

## scalar
adding scalar
`dotnet add package Scalar.AspNetCore`

ok now I setup Inmate.cs and all the desired inputs but one. I want to add an image as well. Maybe even a cam link that can take a photo or use one uploaded. If one isn't available have a standin.png. 
## format
example JSON layout from get


```JSON
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1985-05-15",
    "sex": "M",
    "charge": "Burglary",
    "status": "Active"
  },
  {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1992-11-20",
    "sex": "F",
    "charge": "Assault",
    "status": "Active"
  }
]
```
# Controllers/

## InmateController.cs 
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkInmate;

namespace checkInmate.Controllers
{
    // [ApiController] enforces strict routing and automatically validates incoming JSON payloads
    [ApiController]
    // [Route] sets the base URL for this entire file. 
    // "[controller]" tells the server to look at the class name ("InmateController"), 
    // drop the word "Controller", and use what is left. The base URL becomes: /api/Inmate
    [Route("api/[controller]")]
    public class InmateController : ControllerBase
    {
        // This is a private, read-only variable to hold our database connection. 
        // It prevents other parts of the code from accidentally modifying the connection string.
        private readonly InmateDb _db;

        // THE CONSTRUCTOR (Dependency Injection)
        // When a user hits this URL, the web server automatically builds this class. 
        // We tell the server: "You cannot build this class unless you hand me the InmateDb connection first."
        public InmateController(InmateDb db)
        {
            _db = db;
        }

        // ========================================================================
        // READ ALL (HTTP GET)
        // URL: GET http://localhost:5197/api/Inmate
        // ========================================================================
        [HttpGet]
        public async Task<IActionResult> GetAllInmates()
        {
            // C# Translation of: SELECT * FROM Inmates;
            // .ToListAsync() takes that query, runs it asynchronously so it doesn't freeze the server,
            // and converts the resulting rows into a standard C# List.
            var inmates = await _db.Inmates.ToListAsync();
            
            // Returns an HTTP 200 OK along with the JSON data.
            return Ok(inmates);
        }

        // ========================================================================
        // READ ONE (HTTP GET)
        // URL: GET http://localhost:5197/api/Inmate/{id}
        // ========================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInmate(int id)
        {
            // C# Translation of: SELECT * FROM Inmates WHERE Id = @id LIMIT 1;
            // .FindAsync() optimizes the search by specifically targeting the Primary Key column.
            var inmate = await _db.Inmates.FindAsync(id);

            // If the query returns 0 rows (the inmate does not exist)
            if (inmate == null)
            {
                // Return a standard HTTP 404 Not Found error
                return NotFound();
            }

            // Return HTTP 200 OK with the single record
            return Ok(inmate);
        }

        // ========================================================================
        // CREATE (HTTP POST)
        // URL: POST http://localhost:5197/api/Inmate
        // ========================================================================
        [HttpPost]
        // The [ApiController] tag automatically grabs the JSON body from the request 
        // and tries to map it perfectly into the 'Inmate' C# object parameter here.
        public async Task<IActionResult> CreateInmate(Inmate inmate)
        {
            // C# Translation of: INSERT INTO Inmates (FirstName, LastName, ...) VALUES (@FirstName, @LastName, ...);
            // .Add() stages the query in memory. It does NOT hit the database yet.
            _db.Inmates.Add(inmate);
            
            // This physically executes the staged INSERT command against the database.
            // If the DB generates an auto-incrementing ID, EF Core automatically pulls it back 
            // and attaches it to the 'inmate' variable in memory.
            await _db.SaveChangesAsync();

            // Returns HTTP 201 Created. 
            // Standard REST practices require sending back the location of the newly created resource.
            // This triggers the GetInmate method above to build a URL like: /api/Inmate/3
            return CreatedAtAction(nameof(GetInmate), new { id = inmate.Id }, inmate);
        }

        // ========================================================================
        // UPDATE (HTTP PUT)
        // URL: PUT http://localhost:5197/api/Inmate/{id}
        // ========================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInmate(int id, Inmate updatedInmate)
        {
            // Security check: Ensure they aren't passing /api/Inmate/5 but providing JSON for ID 9.
            if (id != updatedInmate.Id)
            {
                return BadRequest("The ID in the URL must match the ID in the request body.");
            }

            // C# Translation of: SELECT * FROM Inmates WHERE Id = @id LIMIT 1;
            // We must pull the existing record into EF Core's memory tracking first.
            var existingInmate = await _db.Inmates.FindAsync(id);
            if (existingInmate == null)
            {
                return NotFound();
            }

            // C# Translation of: UPDATE Inmates SET FirstName = @FirstName, ... WHERE Id = @id;
            // Because EF Core is "tracking" existingInmate, we just modify the object's properties directly.
            existingInmate.FirstName = updatedInmate.FirstName;
            existingInmate.LastName = updatedInmate.LastName;
            existingInmate.DateOfBirth = updatedInmate.DateOfBirth;
            existingInmate.Sex = updatedInmate.Sex;
            existingInmate.Charge = updatedInmate.Charge;
            existingInmate.Status = updatedInmate.Status;

            // EF Core notices the properties changed and automatically executes the UPDATE SQL command.
            await _db.SaveChangesAsync();

            // Returns HTTP 204 No Content. 
            // The client knows the update worked, and we don't waste bandwidth sending duplicate data back.
            return NoContent();
        }

        // ========================================================================
        // DELETE (HTTP DELETE)
        // URL: DELETE http://localhost:5197/api/Inmate/{id}
        // ========================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInmate(int id)
        {
            // First, find if the record actually exists in the database
            var inmate = await _db.Inmates.FindAsync(id);
            if (inmate == null)
            {
                return NotFound();
            }

            // C# Translation of: DELETE FROM Inmates WHERE Id = @id;
            // .Remove() stages the DELETE command in memory.
            _db.Inmates.Remove(inmate);
            
            // Execute the staged DELETE command against the database.
            await _db.SaveChangesAsync();

            // Returns HTTP 204 No Content. The record is gone.
            return NoContent();
        }
    }
}

```

# Layout
## GUI / Database

so I need to get this figured out, I am sure there plenty of forms out there I can reference and will site if I find a really good one, but I think there has to be a universal layout on this simple stuff

for inmemory I will use Entity framework 
`dotnet add package Microsoft.EntityFrameworkCore.InMemory`

for the GUI I am just going to use the html with links so you can see the API running/is running.
I can sit and write CSS and HTML to make it look probably pretty rough. So I am going to use Gemini to spit out something, but I do understand HTML5/CSS3/JS.
Understanding C# is my goal, so I don't think generated HTML/CSS should be a focus if I can pass over it and make it look good as well.
```html
<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>checkInmate - System Root</title>
        <style>
            body { 
                background-color: #0a0a0a; 
                color: #00ff00; 
                font-family: 'Courier New', Courier, monospace; 
                padding: 40px; 
            }
            .container {
                border: 2px solid #00ff00;
                padding: 20px;
                max-width: 600px;
            }
            h1 { 
                border-bottom: 1px solid #00ff00; 
                padding-bottom: 10px; 
                text-transform: uppercase;
            }
            a { 
                color: #00ff00; 
                text-decoration: none; 
                font-weight: bold;
            }
            a:hover {
                background-color: #00ff00;
                color: #0a0a0a;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>Department of Corrections</h1>
            <p>> INTAKE API : ONLINE</p>
            <p>> VERSION : 1.0.0</p>
            <p>> STATUS : AWAITING COMMAND...</p>
            <br />
            <p><a href='/scalar/v1'>[ ACCESS SYSTEM DOCUMENTATION (SCALAR) ]</a></p>
        </div>
    </body>
    </html>
```










#  Unit Testing
## InmateApi.Tests
'''csharp
using Microsoft.AspNetCore.Mvc.Testing; // Brings in the WebApplicationFactory
using System.Net; // Allows us to check HTTP Status Codes like 200 OK

namespace checkInmate.Tests;

// IClassFixture tells xUnit: "Keep the web server running for all tests in this file 
// so we don't have to wait for it to boot up over and over."
public class InmateApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    // THE CONSTRUCTOR
    // xUnit automatically injects the background web server (factory) into this class.
    public InmateApiTests(WebApplicationFactory<Program> factory)
    {
        // .CreateClient() acts exactly like a web browser or standard frontend application. 
        // It gives us a tool to send GET, POST, PUT, and DELETE requests to the background server.
        _client = factory.CreateClient();
    }

    // [Fact] is the most important part. It tells the xUnit runner that this specific method is a test.
    [Fact]
    public async Task GetAllInmates_ReturnsHttp200Ok()
    {
        // ==========================================
        // 1. ARRANGE
        // Set up any necessary variables or conditions before acting.
        // In this case, we just need the URL string.
        // ==========================================
        string endpoint = "/api/Inmate";

        // ==========================================
        // 2. ACT
        // Execute the code we are actually trying to test.
        // We use our fake browser client to send a GET request to the endpoint.
        // ==========================================
        var response = await _client.GetAsync(endpoint);

        // ==========================================
        // 3. ASSERT
        // Verify that the result matches our expectations.
        // We expect the server to return a 200 OK status code. 
        // If it returns a 404 Not Found or a 500 Server Error, this Assert fails and the test turns red.
        // ==========================================
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
```





# ROADMAP to v1

### Phase 1: Infrastructure and Data Binding (In Progress)
#### This phase establishes the bedrock of the application. You have already completed the bulk of this.

[x] Initialize the Minimal API project (checkInmate).

[x] Configure Scalar for API endpoint documentation.

[x] Define the Inmate C# data model.

[x] Configure the Entity Framework Core in-memory database (InmateDb).

[ ] Next Step: Seed the database with two or three dummy inmate records on startup so you have data to test immediately.

### Phase 2: Core API Endpoints (CRUD)
#### This phase focuses entirely on Program.cs. You will map out the routes the client application will eventually call.

[ ] Create (POST): Build the /inmates/booking endpoint to accept a JSON payload, assign a unique ID, and save the new inmate to the database.

[ ] Read (GET): Build two endpoints. One to fetch the entire active roster (/inmates), and one to fetch a specific inmate by their ID (/inmates/{id}).

[ ] Update (PUT): Build the /inmates/{id} endpoint to allow modifications to an existing record (e.g., updating their housing status or adding new charges).

[ ] Delete (DELETE): Build the /inmates/{id} endpoint to purge a record from the in-memory database.

### Phase 3: The Client Application
#### With the API fully functional and testable via Scalar, you will build the user-facing application that consumes it.

[ ] Initialize the consumer project (e.g., a C# Console App or a basic HTML/JS directory) inside the repository.

[ ] Construct the main layout and navigation loop (the terminal menu or the web dashboard).

[ ] Implement the HTTP request logic (using HttpClient in C# or fetch in JavaScript) to connect to your local API port.

[ ] Wire the user inputs to the API payloads, allowing an intake officer to add, view, edit, and remove records from the UI.

### Phase 4: Automated Testing Suite
#### This phase fulfills the strict Capstone requirement for proving your code works programmatically.

[ ] Create a new testing project within the solution (using xUnit or NUnit).

[ ] Install Microsoft.AspNetCore.Mvc.Testing to spin up a test version of your API in the background.

[ ] Write a test asserting that a valid POST request successfully creates an inmate.

[ ] Write a test asserting that a GET request returns the expected data.

[ ] Write tests for invalid execution paths (e.g., requesting an inmate ID that does not exist returns a 404 Not Found).

### Phase 5: v1.0 Release and Submission
#### The final pass to ensure everything meets the graduation requirements.

[ ] Perform a clean build of the entire solution to ensure no compiler warnings or errors remain.

[ ] Execute the test suite one final time to confirm full passage.

[ ] Complete the required sections in the README.md (Project Retrospective and Future Roadmap).

[ ] Push all three projects (API, Client, Tests) to your single GitHub repository.

[ ] Submit the repository link before the noon deadline.

___
