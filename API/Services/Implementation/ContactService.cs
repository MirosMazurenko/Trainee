using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Repositories.Implementation;
using API.Services.Interfaces;
using AutoMapper;

namespace API.Services.Implementation
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly IMapper _mapper;

        public ContactService(IContactRepository contactRepository, IMapper mapper)
        {
            _contactRepository = contactRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ContactDto>> GetAllContactsAsync()
        {
            var contacts = await _contactRepository.GetAllContactsAsync();
            return _mapper.Map<IEnumerable<ContactDto>>(contacts);
        }

        public async Task<ContactDto> GetContactByIdAsync(int id)
        {
            var contact = await _contactRepository.GetContactByIdAsync(id);
            return _mapper.Map<ContactDto>(contact);
        }

        public async Task<ContactDto> AddContactAsync(ContactDto contactDto)
        {
            var contact = _mapper.Map<Contact>(contactDto);
            await _contactRepository.AddContactAsync(contact);
            return _mapper.Map<ContactDto>(contact);
        }

        public async Task UpdateContactAsync(ContactDto contactDto)
        {
            var contact = _mapper.Map<Contact>(contactDto);
            await _contactRepository.UpdateContactAsync(contact);
        }

        public async Task DeleteContactAsync(int id)
        {
            await _contactRepository.DeleteContactAsync(id);
        }
    }
}