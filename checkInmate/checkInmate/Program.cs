using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using checkInmate;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();  

// THIS IS THE CRITICAL LINE THAT WAS MISSING
builder.Services.AddDbContext<InmateDb>(options =>
    options.UseInMemoryDatabase("InmateList"));

// Add services to the container.
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

app.UseHttpsRedirection();

//using html for landing page when click from console
app.MapGet("/", () => Results.Content(@"
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
", "text/html"));

// root endpoint // layout of site before heavy lifting
// app.MapGet("/", () => "checkInmate API is online and listening.");
app.MapGet("/firstrun", () => "first run page");
app.MapGet("/intake", () => "intake inmate");
app.MapGet("/update", () => "update current inmates");
app.MapGet("/release", () => "release form");
app.MapGet("/search", () => "search for current inmates");

app.MapControllers();
app.Run();