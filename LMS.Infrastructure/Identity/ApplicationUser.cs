using LMS.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Infrastructure.Identity
{
   
    
        public  class ApplicationUser : IdentityUser
        {
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public string? ProfilePictureUrl { get; set; }
            public DateTime CreatedAt
            {
                get; set;
            }

        public ICollection<Book> Books { get; set; } = new List<Book>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    }
}
