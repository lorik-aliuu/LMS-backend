using LMS.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace LMS.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;


        public ExceptionHandlingMiddleware(
       RequestDelegate next,
       ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }


        private  Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            var message = "An unexpected error occurred";

           
            switch (exception)
            {
                case NotFoundException:
                    statusCode = HttpStatusCode.NotFound; 
                    message = exception.Message;
                    break;

                case ValidationException:
                    statusCode = HttpStatusCode.BadRequest; 
                    message = exception.Message;
                    break;

                case UnauthorizedException:
                    statusCode = HttpStatusCode.Unauthorized; 
                    message = exception.Message;
                    break;

                case DomainException:
                    statusCode = HttpStatusCode.BadRequest; 
                    message = exception.Message;
                    break;

                default:
                    _logger.LogError(exception, "Unhandled exception occurred");
                    message = "An unexpected error occurred. Please try again later.";
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                success = false,
                message = message,
                statusCode = (int)statusCode
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return context.Response.WriteAsync(json);
        }
    }
}
