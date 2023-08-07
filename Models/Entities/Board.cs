namespace Board.Models.Entities;

public partial class Board
{
    public enum BoardValidateResult { Done = 0, NoExistData = 2001, NotAuthentication = 2002, NotAuthorization = 2003, UnknownError = 2004 }

    public long Bid { get; set; }

    public long Uid { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public long CreateTime { get; set; }
}
