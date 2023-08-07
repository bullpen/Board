using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class SessionFilter : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var httpContext = context.HttpContext;
        if (!httpContext.Session.TryGetValue("Email", out _))
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
