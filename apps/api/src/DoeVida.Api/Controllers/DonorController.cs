using DoeVida.Application.UseCases.GetDonorById;
using DoeVida.Application.UseCases.GetDonors;
using DoeVida.Application.UseCases.RegisterDonor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoeVida.Api.Controllers;

[ApiController]
[Route("api/donors")]
public class DonorController : ControllerBase
{
    private readonly RegisterDonorHandler _registerHandler;
    private readonly GetDonorsHandler _getHandler;
    private readonly GetDonorByIdHandler _getByIdHandler;

    public DonorController(
        RegisterDonorHandler handler,
        GetDonorsHandler getHandler,
        GetDonorByIdHandler getByIdHandler)
    {
        _registerHandler = handler;
        _getHandler = getHandler;
        _getByIdHandler = getByIdHandler;
    }

    /// <summary>Cadastro público de doador (sem autenticação).</summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterDonorCommand command, CancellationToken cancellationToken = default)
    {
        var result = await _registerHandler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetAll([FromQuery] GetDonorsQuery query, CancellationToken cancellationToken = default)
    {
        var result = await _getHandler.Handle(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retorna o detalhe completo do doador (dados pessoais, cadastro, última doação, próxima doação, histórico).
    /// Usado pela tela de detalhe na área administrativa.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await _getByIdHandler.Handle(id, cancellationToken);
        if (result == null)
            return NotFound();
        return Ok(result);
    }
}
