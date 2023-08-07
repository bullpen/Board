using Board.Client.Models;
using Board.Controllers.Base;
using Board.Models.Account;
using Board.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using static Board.Models.Entities.Account;

namespace Board.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateAccount parameter)
        {
            var validResult = await _accountService.ValidateAccount(parameter);

            if (validResult != AccountValidateResult.Done)
            {
                return StatusCode(401, new ExecResultModel { ResultCode = (int)validResult });
            }

            var execResult = await _accountService.CreateAccount(parameter);

            if (execResult == false)
            {
                return StatusCode(401, new ExecResultModel { ResultCode = (int)AccountValidateResult.FailedCreateAccount });
            }

            return StatusCode(200, new ExecResultModel { ResultCode = (int)AccountValidateResult.Done });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginAccount parameter)
        {
            var account = await _accountService.GetAccount(parameter);

            if (account != null)
            {
                HttpContext.Session.SetString("Email", account.Email);
                HttpContext.Session.SetString("Uid", account.Uid.ToString());
                HttpContext.Session.SetString("NickName", account.NickName.ToString());

                return StatusCode(200, new { Email = account.Email, Nickname = account.NickName, Uid = account.Uid });
            }

            return StatusCode(401);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();

            return StatusCode(200, new ExecResultModel { ResultCode = 0 });
        }

        [HttpGet("session")]
        public IActionResult CheckSession()
        {
            if (string.IsNullOrEmpty(GetUserEmail()))
            {
                return StatusCode(401);
            }

            return StatusCode(200, new { Email = GetUserEmail(), Nickname = GetUserNickName(), Uid = GetUserUid() });
        }
    }
}
