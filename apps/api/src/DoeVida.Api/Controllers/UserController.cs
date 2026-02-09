using DoeVida.Application.UseCases.GetUsers;
using DoeVida.Application.UseCases.RegisterUser;
using DoeVida.Application.UseCases.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace DoeVida.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UserController : ControllerBase
{
    private readonly RegisterUserHandler _registerUserHandler;
    private readonly GetUsersHandler _getUsersHandler;
    public UserController(RegisterUserHandler registerUserHandler, GetUsersHandler getUsersHandler)
    {
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
