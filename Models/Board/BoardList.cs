namespace Board.Models.Board
{
    public class BoardList
    {
        public List<BoardRow> List { get; set; }
        public bool HasNextPage { get; set; }
    }

    public class BoardRow
    {
        public long Bid { get; set; }
        public string Title { get; set; }
        public string NickName { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
