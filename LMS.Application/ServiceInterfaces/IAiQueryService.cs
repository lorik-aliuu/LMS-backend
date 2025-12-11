using LMS.Application.DTOs.AI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Application.ServiceInterfaces
{
    public interface IAiQueryService
    {
        Task<AiQueryResponseDTO>ProcessQueryAsync(string query, string userId, bool isAdmin);
    }
}
