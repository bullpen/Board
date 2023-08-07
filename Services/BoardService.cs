using Board.Context;
using Board.Models.Board;
using Board.Models.Entities;
using Board.Services.Interface;
using Microsoft.EntityFrameworkCore;
using static Board.Models.Entities.Board;

namespace Board.Services
{
    public class BoardService : IBoardService
    {
        private readonly BoardContext _boardContext;
        private readonly IHttpContextAccessor _contextAccessor;

        public BoardService(BoardContext boardContext, IHttpContextAccessor contextAccessor)
        {
            _boardContext = boardContext;
            _contextAccessor = contextAccessor;
        }



        public async Task<BoardView?> View(long bid)
        {
            var board = await _boardContext.Boards.FirstOrDefaultAsync(b => b.Bid == bid);

            if (board != null)
            {
                var account = await _boardContext.Accounts.FirstOrDefaultAsync(a => a.Uid == board.Uid);

                return new BoardView
                {
                    Bid = board.Bid,
                    Uid = board.Uid,
                    NickName = account != null ? account.NickName : "N/A",
                    Title = board.Title,
                    Content = board.Content,
                    CreateTime = DateTimeOffset.FromUnixTimeSeconds(board.CreateTime).AddHours(9).DateTime
                };
            }

            return null;
        }


        public async Task<BoardList> List(int pageNo, int pageSize)
        {
            int itemsToSkip = (pageNo - 1) * pageSize;

            BoardList boardList = new BoardList();

            Task<List<BoardRow>> itemsPage = (from board in _boardContext.Boards
                                              join account in _boardContext.Accounts
                                              on board.Uid equals account.Uid into accountGroup
                                              from account in accountGroup.DefaultIfEmpty()
                                              orderby board.Bid descending
                                              select new BoardRow
                                              {
                                                  Bid = board.Bid,
                                                  Title = board.Title,
                                                  NickName = account != null ? account.NickName : "N/A",
                                                  CreateTime = DateTimeOffset.FromUnixTimeSeconds(board.CreateTime).AddHours(9).DateTime
                                              })
                .Skip(itemsToSkip)
                .Take(pageSize * 2)
                .ToListAsync();

            var list = await itemsPage;

            boardList.HasNextPage = list.Count > pageSize;
            boardList.List = list.Take(pageSize).ToList();

            return boardList;
        }

        public async Task<BoardValidateResult> Modify(long bid, BoardModify board)
        {
            ISession session = _contextAccessor.HttpContext.Session;

            var uid = Convert.ToInt64(session.GetString("Uid"));
            var boardView = await _boardContext.Boards.FirstOrDefaultAsync(b => b.Bid == bid);

            if (boardView == null)
            {
                return BoardValidateResult.NoExistData;
            }
            else if (boardView.Uid != uid)
            {
                return BoardValidateResult.NotAuthorization;
            }

            boardView.Title = board.Title;
            boardView.Content = board.Content;

            _boardContext.Boards.Update(boardView);

            var execResult = await _boardContext.SaveChangesAsync() > 0;

            if (execResult == false)
            {
                return BoardValidateResult.UnknownError;
            }


            return BoardValidateResult.Done;
        }

        public async Task<BoardValidateResult> Delete(long bid)
        {
            ISession session = _contextAccessor.HttpContext.Session;

            var uid = Convert.ToInt64(session.GetString("Uid"));
            var boardView = await _boardContext.Boards.FirstOrDefaultAsync(b => b.Bid == bid);

            if (boardView == null)
            {
                return BoardValidateResult.NoExistData;
            }
            else if (boardView.Uid != uid)
            {
                return BoardValidateResult.NotAuthorization;
            }

            _boardContext.Boards.Remove(boardView);

            var execResult = await _boardContext.SaveChangesAsync() > 0;

            if (execResult == false)
            {
                return BoardValidateResult.UnknownError;
            }


            return BoardValidateResult.Done;
        }

        public async Task<BoardValidateResult> Write(BoardWrite board)
        {
            ISession session = _contextAccessor.HttpContext.Session;

            _boardContext.Boards.Add(new Board.Models.Entities.Board
            {
                Content = board.Content,
                Title = board.Title,
                Uid = Convert.ToInt64(session.GetString("Uid")),
                CreateTime = ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds()
            });

            var execResult = await _boardContext.SaveChangesAsync() > 0;

            if (execResult == false)
            {
                return BoardValidateResult.UnknownError;
            }

            return BoardValidateResult.Done;
        }
    }
}
