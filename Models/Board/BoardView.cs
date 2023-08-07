namespace Board.Models.Board
{
    public class BoardView
    {
        public long Bid { get; set; }

        public long Uid { get; set; }

        public string NickName { get; set; }

        public string Title { get; set; } = null!;

        public string Content { get; set; } = null!;

        public DateTime CreateTime { get; set; }
    }
}
