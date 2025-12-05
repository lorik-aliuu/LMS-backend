using LMS.Domain.Entities;
using LMS.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Infrastructure.EntityConfigurations
{
    public class BookConfiguration : IEntityTypeConfiguration<Book>
    {

        public void Configure(EntityTypeBuilder<Book> builder)
        {
            builder.HasOne<ApplicationUser>()
           .WithMany(u => u.Books)
           .HasForeignKey(b => b.UserId);

            builder.HasIndex(b => b.UserId);


        }
    }
}