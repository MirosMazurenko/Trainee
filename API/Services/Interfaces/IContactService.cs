using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;

namespace API.Services.Interfaces
{
    public interface IContactService
    {
        Task<IEnumerable<ContactDto>> GetAllContactsAsync();
        Task<ContactDto> GetContactByIdAsync(int id);
        Task<ContactDto> AddContactAsync(ContactDto contactDto);
        Task UpdateContactAsync(ContactDto contactDto);
        Task DeleteContactAsync(int id);
    }
}