    using LMS.Application.ServiceInterfaces;
    using LMS.Infrastructure.Hubs;
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace LMS.Infrastructure.Services
    {
        public class UserNotifierService : IUserNotifierService
        {
            private readonly IHubContext<UserEventHub> _hubContext;

            public UserNotifierService(IHubContext<UserEventHub> hubContext)
            {
                _hubContext = hubContext;
            }

            public async Task NotifyUserRoleChangedAsync(string userId, string newRole)
        {
            await _hubContext.Clients.User(userId).SendAsync("UserRoleChanged", newRole);
        }

            public async Task NotifyAccountDeletedAsync(string userId)
            {
                await _hubContext.Clients.User(userId).SendAsync("AccountDeleted");
            }

           
        }
    }
