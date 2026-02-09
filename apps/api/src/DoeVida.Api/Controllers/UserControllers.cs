using DoeVida.Application.UseCases.GetUsers;
using DoeVida.Application.UseCases.RegisterUser;
using DoeVida.Application.UseCases.User;
using Microsoft.AspNetCore.Mvc;


namespace DoeVida.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserControllers : ControllerBase
{
    private readonly ILogger<UserControllers> _logger;
    private readonly RegisterUserHandler _registerUserHandler;
    private readonly GetUsersHandler _getUsersHandler;
    public UserControllers(ILogger<UserControllers> logger, RegisterUserHandler registerUserHandler, GetUsersHandler getUsersHandler)
    {
        _logger = logger;
        _registerUserHandler = registerUserHandler;
        _getUsersHandler = getUsersHandler;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command, CancellationToken cancellationToken = default)
    {
        var result = await _registerUserHandler.Handle(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query, CancellationToken cancellationToken = default)
    {
        var result = await _getUsersHandler.Handle(query, cancellationToken);
        return Ok(result);
    }
}
