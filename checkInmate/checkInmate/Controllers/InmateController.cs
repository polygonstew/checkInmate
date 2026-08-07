using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Required for ToListAsync
using checkInmate; // Gives access to InmateDb and Inmate model

namespace checkInmate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InmateController : ControllerBase
    {
        // A private field to hold our database connection
        private readonly InmateDb _db;

        // The Constructor: The web server automatically passes the database in here
        public InmateController(InmateDb db)
        {
            _db = db;
        }

        // GET: api/Inmate
        [HttpGet]
        public async Task<IActionResult> GetAllInmates()
        {
            // Fetch all records from the in-memory database asynchronously
            var inmates = await _db.Inmates.ToListAsync();
            
            // Return them with an HTTP 200 OK status
            return Ok(inmates);
        }
    }
}