import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import moment from 'moment';

export const Board = () => {
    const { currentUserUid } = useContext(UserContext);
    const [pageNo, setPageNo] = useState(1);
    const [boardList, setBoardList] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`api/board/list/${pageNo}/10`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.status === 200) {
                    const data = await response.json() ?? [];

                    setBoardList(data.items.list);
                    setHasNextPage(data.items.hasNextPage);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [pageNo]);

    const handleBoardWriteClick = () => {
        window.history.pushState(null, '', '/boardwrite');
        window.dispatchEvent(new Event('popstate'));
    }

    const handlePrevPageClick = () => {
        if (pageNo - 1 < 1) {
            return;
        }

        setPageNo(pageNo - 1);
    }

    const handleNextPageClick = () => {
        if (hasNextPage === false) {
            return;
        }

        setPageNo(pageNo + 1);
    }

    const handleBoardRowClick = (event) => {
        const bid = event.currentTarget.getAttribute('data-bid');


        window.history.pushState(null, '', `/boardview/${bid}`);
        window.dispatchEvent(new Event('popstate'));
    };

    return (
        <>
            {currentUserUid !== "0" &&
                <div style={{ width: "100%", textAlign: "right" }}>
                    <button className="btn btn-primary" onClick={handleBoardWriteClick}>글쓰기</button>
                </div>
            }
            <table className="table table-striped table-bordered table-board">
                <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "500px" }} />
                    <col style={{ width: "150px" }} />
                    <col style={{ width: "150px" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="bg-success text-white">글번호</th>
                        <th className="bg-success text-white">제목</th>
                        <th className="bg-success text-white">글쓴이</th>
                        <th className="bg-success text-white">날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {boardList.length > 0 && boardList.map((board) => (
                        <tr key={board.bid} data-bid={board.bid} onClick={handleBoardRowClick}>
                            <td>{board.bid}</td>
                            <td>{board.title}</td>
                            <td>{board.nickName}</td>
                            <td>{moment(board.createTime).format("YYYY-MM-DD hh:mmA")}</td>
                        </tr>
                    ))}
                    {boardList.length === 0 &&
                        <tr>
                            <td colSpan="4" className="text-center">데이터가 없습니다.</td>
                        </tr>
                    }
                </tbody>
            </table>
            <div style={{ width: "100%", textAlign: "center" }}>
                <button className="btn btn-sm btn-primary" onClick={handlePrevPageClick}>이전</button>
                <span style={{ padding: "5px", fontWeight: "bold" }} >{pageNo}</span>
                <button className="btn btn-sm btn-primary" onClick={handleNextPageClick}>다음</button>
            </div>
        </>
    )
}

