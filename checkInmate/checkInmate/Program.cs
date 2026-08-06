using Scalar.AspNetCore;
using checkInmate;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Add Scalar to the pipeline
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// root endpoint // layout of site before heavy lifting
app.MapGet("/", () => "checkInmate API is online and listening.");
app.MapGet("/firstrun", () => "first run page");
app.MapGet("/intake", () => "intake inmate");
app.MapGet("/update", () => "update current inmates");
app.MapGet("/release", () => "release form");
app.MapGet("/search", () => "search for current inmates");

// Example Endpoint Setup
app.MapGet("/api/inmates", () => new[]
{
    new { Id = 1, Name = "John Doe", Status = "Active" },
    new { Id = 2, Name = "Jane Smith", Status = "Released" }
})
.WithName("GetInmates")
.WithTags("Inmate Management Operations");

app.Run();