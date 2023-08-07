using Board.Client.Models;
using Board.Models.Board;
using Board.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Board.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardController : ControllerBase
    {
        private readonly IBoardService _boardService;

        public BoardController(IBoardService boardService)
        {
            _boardService = boardService;
        }

        [SessionFilter]
        [HttpPost("write")]
        public async Task<IActionResult> Write(BoardWrite parameter)
        {
            var executeResult = await _boardService.Write(parameter);

            return StatusCode(200, new ExecResultModel { ResultCode = (int)executeResult });
        }

        [HttpGet("list/{pageNo:int}/{pageSize:int}")]
        public async Task<IActionResult> List(int pageNo = 1, int pageSize = 20)
        {
            var list = await _boardService.List(pageNo, pageSize);

            return StatusCode(200, new { PageNo = pageNo, Items = list });
        }

        [HttpGet("view/{bid:long}")]
        public async Task<IActionResult> View(long bid)
        {
            var boardView = await _boardService.View(bid);

            return StatusCode(200, boardView);
        }

        [SessionFilter]
        [HttpPost("modify/{bid:long}")]
        public async Task<IActionResult> Modify(long bid, [FromBody] BoardModify parameter)
        {
            var executeResult = await _boardService.Modify(bid, parameter);

            return StatusCode(200, new ExecResultModel { ResultCode = (int)executeResult });
        }

        [SessionFilter]
        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] long bid)
        {
            var executeResult = await _boardService.Delete(bid);

            return StatusCode(200, new ExecResultModel { ResultCode = (int)executeResult });
        }
    }
}
