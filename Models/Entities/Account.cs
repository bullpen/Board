namespace Board.Models.Entities;

public partial class Account
{
    public enum AccountValidateResult { Done = 0, ExistEmail = 1001, ExistNickName = 1002, FailedCreateAccount = 1003 }

    public long Uid { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string NickName { get; set; } = null!;

    public long CreateTime { get; set; }
}
