using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Application.DTOs.Auth
{
    public class RevokeTokenRequestDTO
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
