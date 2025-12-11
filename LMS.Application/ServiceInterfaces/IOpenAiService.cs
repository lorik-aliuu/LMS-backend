using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Application.ServiceInterfaces
{
    public interface IOpenAiService
    {
        Task<string> AnalyzeQueryAsync(string userQuery, string context);
        Task<string> GenerateAnswerAsync(string query, string data);
    }
}
