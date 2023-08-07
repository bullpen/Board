using Microsoft.AspNetCore.Mvc;

namespace Board.Controllers.Base
{
    public class BaseController : ControllerBase
    {
        protected string? GetUserEmail()
        {
            return HttpContext.Session?.GetString("Email");
        }

        protected string? GetUserUid()
        {
            return HttpContext.Session?.GetString("Uid");
        }

        protected string? GetUserNickName()
        {
            return HttpContext.Session?.GetString("NickName");
        }
    }
}
