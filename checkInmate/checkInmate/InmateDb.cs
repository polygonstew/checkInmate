using Microsoft.EntityFrameworkCore;

namespace checkInmate;

public class InmateDb : DbContext
{
    public InmateDb(DbContextOptions<InmateDb> options) : base(options) { }

    // actual table in database
    public DbSet<Inmate> Inmates => Set<Inmate>();
}