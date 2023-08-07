using Board.Models.Account;
using Board.Models.Entities;
using static Board.Models.Entities.Account;

namespace Board.Services.Interface
{
    public interface IAccountService
    {

        Task<bool> CreateAccount(CreateAccount account);

        Task<AccountValidateResult> ValidateAccount(CreateAccount account);

        Task<Account?> GetAccount(LoginAccount account);
    }
}
