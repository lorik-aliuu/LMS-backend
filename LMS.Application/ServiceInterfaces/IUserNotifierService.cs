using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Application.ServiceInterfaces
{
    public interface IUserNotifierService
    {
        Task NotifyUserRoleChangedAsync(string userId, string newRole);
        Task NotifyAccountDeletedAsync(string userId);
    
    }
}
