using System.Net;
using System.Text.Json;
using DoeVida.Api.Contract;
using DoeVida.Domain.Exceptions;

namespace DoeVida.Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
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
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var (statusCode, type, message, errors) = ex switch
        {
            UnauthorizedAccessException
                => (HttpStatusCode.Unauthorized, "Unauthorized", "Não autorizado. Faça login ou verifique seu token.", null),
            InvalidOperationException when ex.Message.Contains("já cadastrado", StringComparison.OrdinalIgnoreCase)
                => (HttpStatusCode.Conflict, "Conflict", ex.Message, null),
            InvalidOperationException
                => (HttpStatusCode.BadRequest, "BadRequest", ex.Message, null),
            DomainException domainEx
                => (HttpStatusCode.BadRequest, "ValidationError", "Um ou mais erros de validação ocorreram.",
                    ParseValidationErrors(domainEx.Message)),
            ArgumentException
                => (HttpStatusCode.BadRequest, "BadRequest", ex.Message, null),
            _ => (HttpStatusCode.InternalServerError, "InternalServerError",
                context.RequestServices.GetService<IWebHostEnvironment>()?.IsDevelopment() == true
                    ? ex.Message
                    : "Ocorreu um erro interno. Tente novamente mais tarde.",
                null),
        };

        if ((int)statusCode >= 500)
            _logger.LogError(ex, "Erro não tratado: {Message}", ex.Message);
        else
            _logger.LogWarning("Erro de validação/negócio: {Message}", ex.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new ApiErrorResponse
        {
            Type = type,
            Message = message,
            Errors = errors,
        };

        var body = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(body);
    }

    private static List<ValidationErrorItem>? ParseValidationErrors(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return null;

        var parts = message.Split("; ", StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
            return null;

        return parts
            .Select(p => new ValidationErrorItem
            {
                Field = "General",
                Message = p.Trim(),
            })
            .ToList();
    }
}
