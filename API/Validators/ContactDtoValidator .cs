using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using FluentValidation;

namespace API.Validators
{
    public class ContactDtoValidator : AbstractValidator<ContactDto>
    {
        public ContactDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(100).WithMessage("Name can't be longer than 100 characters");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required")
                .LessThan(DateTime.Today).WithMessage("Date of birth must be in the past");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone is required")
                .Matches(@"^\+?\d{10,}$").WithMessage("Phone number format is invalid");

            RuleFor(x => x.Salary)
                .GreaterThanOrEqualTo(0).WithMessage("Salary must be greater than or equal to 0");
        }
    }
}