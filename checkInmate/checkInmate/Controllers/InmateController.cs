using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using checkInmate;

namespace checkInmate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InmateController : ControllerBase
    {
        private readonly InmateDb _db;

        public InmateController(InmateDb db)
        {
            _db = db;
        }

        // GET: api/Inmate
        [HttpGet]
        public async Task<IActionResult> GetAllInmates()
        {
            var inmates = await _db.Inmates.ToListAsync();
            return Ok(inmates);
        }

        // GET: api/Inmate/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInmate(int id)
        {
            var inmate = await _db.Inmates.FindAsync(id);

            if (inmate == null)
            {
                return NotFound();
            }

            return Ok(inmate);
        }

        // POST: api/Inmate
        [HttpPost]
        public async Task<IActionResult> CreateInmate(Inmate inmate)
        {
            _db.Inmates.Add(inmate);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInmate), new { id = inmate.Id }, inmate);
        }

        // PUT: api/Inmate/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInmate(int id, Inmate updatedInmate)
        {
            // 1. Check if the ID in the URL matches the ID in the JSON body
            if (id != updatedInmate.Id)
            {
                return BadRequest("The ID in the URL must match the ID in the request body.");
            }

            // 2. Look up the existing record in the database
            var existingInmate = await _db.Inmates.FindAsync(id);
            if (existingInmate == null)
            {
                return NotFound();
            }

            // 3. Update the fields
            existingInmate.FirstName = updatedInmate.FirstName;
            existingInmate.LastName = updatedInmate.LastName;
            existingInmate.DateOfBirth = updatedInmate.DateOfBirth;
            existingInmate.Sex = updatedInmate.Sex;
            existingInmate.Charge = updatedInmate.Charge;
            existingInmate.Status = updatedInmate.Status;

            // 4. Save the changes
            await _db.SaveChangesAsync();

            // 5. Industry standard for a successful update is returning a 204 No Content
            return NoContent();
        }

        // DELETE: api/Inmate/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInmate(int id)
        {
            // 1. Find the record
            var inmate = await _db.Inmates.FindAsync(id);
            if (inmate == null)
            {
                return NotFound();
            }

            // 2. Remove it from the database tracking and save
            _db.Inmates.Remove(inmate);
            await _db.SaveChangesAsync();

            // 3. Return 204 No Content
            return NoContent();
        }
    }
}