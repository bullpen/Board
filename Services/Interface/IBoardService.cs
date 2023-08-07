using Board.Models.Board;
using static Board.Models.Entities.Board;

namespace Board.Services.Interface
{
    public interface IBoardService
    {

        Task<BoardValidateResult> Write(BoardWrite board);

        Task<BoardValidateResult> Modify(long bid, BoardModify board);

        Task<BoardValidateResult> Delete(long bid);

        Task<BoardView?> View(long bid);

        Task<BoardList> List(int pageNo, int pageSize);
    }
}
