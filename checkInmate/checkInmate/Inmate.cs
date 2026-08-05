namespace checkInmate;

public class Inmate
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string? Sex { get; set; }
    public string? Charge { get; set; }
    public string? Status { get; set; }
}