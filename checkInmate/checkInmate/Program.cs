using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using checkInmate;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();  

builder.Services.AddDbContext<InmateDb>(options =>
    options.UseInMemoryDatabase("InmateList"));


builder.Services.AddOpenApi();

var app = builder.Build();

// --- SEED DATA BLOCK ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InmateDb>();
    db.Database.EnsureCreated();
    
    if (!db.Inmates.Any())
    {
        db.Inmates.AddRange(
            new Inmate 
            { 
                Id = 1, 
                FirstName = "John", 
                LastName = "Doe", 
                DateOfBirth = new DateTime(1985, 5, 15), 
                Sex = "M", 
                Charge = "Burglary", 
                Status = "Active" 
            },
            new Inmate 
            { 
                Id = 2, 
                FirstName = "Jane", 
                LastName = "Smith", 
                DateOfBirth = new DateTime(1992, 11, 20), 
                Sex = "F", 
                Charge = "Assault", 
                Status = "Active" 
            }
        );
        db.SaveChanges();
    }
}
// -----------------------

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Add Scalar to the pipeline
    app.MapScalarApiReference();
}
// Removed because it's trying to push HTTPS, stops the warnings in the API run
// app.UseHttpsRedirection(); 

// root endpoint // layout of site before heavy lifting
// app.MapGet("/", () => "checkInmate API is online and listening.");
//HTML file use
// Tells the server to automatically look for a file named "index.html"
app.UseDefaultFiles(); 
// Tells the server it is allowed to serve files from a folder named "wwwroot"
app.UseStaticFiles();


app.MapControllers();
app.Run();
public partial class Program { }