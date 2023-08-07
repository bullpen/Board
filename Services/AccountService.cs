using Board.Context;
using Board.Models.Account;
using Board.Models.Entities;
using Board.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static Board.Models.Entities.Account;

namespace Board.Services
{
    public class AccountService : IAccountService
    {
        private readonly BoardContext _boardContext;

        public AccountService(BoardContext boardContext)
        {
            _boardContext = boardContext;
        }

        public async Task<bool> CreateAccount(CreateAccount account)
        {
            var passwordHasher = new PasswordHasher<string>();

            account.Password = passwordHasher.HashPassword(null, account.Password);

            _boardContext.Accounts.Add(new Account
            {
                Email = account.Email.ToLower(),
                NickName = account.NickName.ToLower(),
                Password = account.Password,
                CreateTime = ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds(),
            });

            int execResult = await _boardContext.SaveChangesAsync();

            return execResult > 0;
        }

        public async Task<AccountValidateResult> ValidateAccount(CreateAccount account)
        {

            var existList = await _boardContext.Accounts.AsNoTracking().Where(a =>
                                            a.Email == account.Email.ToLower()
                                            || a.NickName == account.NickName.ToLower()
                            ).ToListAsync();

            if (existList.Any(a => a.Email == account.Email.ToLower()))
            {
                return AccountValidateResult.ExistEmail;
            }
            else if (existList.Any(a => a.NickName == account.NickName.ToLower()))
            {
                return AccountValidateResult.ExistNickName;
            }

            return AccountValidateResult.Done;
        }

        public async Task<Account?> GetAccount(LoginAccount account)
        {
            var passwordHasher = new PasswordHasher<string>();

            var user = await _boardContext.Accounts.AsNoTracking().FirstOrDefaultAsync(a => a.Email == account.Email.ToLower());

            if (user == null)
            {
                return null;
            }

            var isPasswordMatch = passwordHasher.VerifyHashedPassword(null, user.Password, account.Password);

            if (isPasswordMatch == PasswordVerificationResult.Success)
            {
                return user;
            }

            return null;
        }
    }
}
