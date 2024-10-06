using System.Globalization;
using API.DTOs;
using API.Services.Interfaces;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactsController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllContacts()
    {
        var contacts = await _contactService.GetAllContactsAsync();
        return Ok(contacts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetContactById(int id)
    {
        var contact = await _contactService.GetContactByIdAsync(id);
        if (contact == null) return NotFound();
        return Ok(contact);
    }

    [HttpPost]
    public async Task<IActionResult> CreateContact([FromBody] ContactDto contactDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdContact = await _contactService.AddContactAsync(contactDto);
        return CreatedAtAction(nameof(GetContactById), new { id = createdContact.Id }, createdContact);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContact(int id, [FromBody] ContactDto contactDto)
    {
        if (id != contactDto.Id)
        {
            return BadRequest("ID mismatch");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _contactService.UpdateContactAsync(contactDto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
        await _contactService.DeleteContactAsync(id);
        return NoContent();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadContacts([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HeaderValidated = null,
                MissingFieldFound = null
            };

            using var stream = new StreamReader(file.OpenReadStream());
            using var reader = new CsvReader(stream, config);
            var records = reader.GetRecords<ContactDto>().ToList();

            if (records.Count == 0)
            {
                return BadRequest("The uploaded file is empty or contains no valid records.");
            }

            foreach (var record in records)
            {
                await _contactService.AddContactAsync(record);
            }

            return Ok(new { message = $"{records.Count} contacts uploaded successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error uploading contacts: {ex}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
