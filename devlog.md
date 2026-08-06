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


# Layout
## GUI / Database

so I need to get this figured out, I am sure there plenty of forms out there I can reference and will site if I find a really good one, but I think there has to be a universal layout on this simple stuff

for inmemory I will use Entity framework 
`dotnet add package Microsoft.EntityFrameworkCore.InMemory`


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
