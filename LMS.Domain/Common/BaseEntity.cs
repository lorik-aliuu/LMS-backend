using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Domain.Common
{
    public abstract class BaseEntity
    {

        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; }
        public DateTime? UpdatedAt { get; set; }


        protected BaseEntity()
        {
            CreatedAt = DateTime.UtcNow;
            IsDeleted = false;
        }
    }
}
