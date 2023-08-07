import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../context/UserContext';
import CustomModal from '../common/Modal';
import moment from 'moment';

export const BoardView = () => {
    const { currentUserUid } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [nickName, setNickName] = useState("");
    const [uid, setUid] = useState(0);
    const [createTime, setCreateTime] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const { bid } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`api/board/view/${bid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.status === 200) {
                    const data = await response.json() ?? [];

                    setTitle(data.title);
                    setContent(data.content);
                    setNickName(data.nickName);
                    setCreateTime(data.createTime);
                    setUid(data.uid);
                } else {
                    setModalMessage("오류가 발생했습니다. 고객센타에 연락해주시기 바랍니다.");
                    setShowModal(true);
                }

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);


    const handleBoardModifyClick = async () => {
        window.history.pushState(null, '', `/boardwrite/${bid}`);
        window.dispatchEvent(new Event('popstate'));
    }

    const handleBoardCancelClick = () => {
        window.history.pushState(null, '', '/board');
        window.dispatchEvent(new Event('popstate'));
    }

    const handleBoardDeleteClick = async () => {
        const response = await fetch("api/board/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bid)
        });

        if (response.status === 200) {
            const executeResult = await response.json();

            switch (executeResult.resultCode) {
                case 0:
                    window.history.pushState(null, '', `/board`);
                    window.dispatchEvent(new Event('popstate'));
                    return;
                case 2001:
                    setModalMessage("해당글이 존재하지 않습니다.");
                    break;
                case 2003:
                    setModalMessage("자신이 작성한 글만 삭제가 가능합니다.");
                    break;
                case 2004:
                default:
                    setModalMessage("오류가 발생했습니다. 고객센타에 연락해주시기 바랍니다.");
            }
        } else if (response.status === 401) {
            setModalMessage("로그인 후에 글을 삭제하실 수 있습니다.");
        }

        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <table className="table table-bordered">
                <colgroup>
                    <col style={{ width: "200px" }} />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <th className="bg-success text-white">작성일자</th>
                        <td>
                            {moment(createTime).format("YYYY-MM-DD hh:mmA")}
                        </td>
                    </tr>
                    <tr>
                        <th className="bg-success text-white">제목</th>
                        <td>
                            {title}
                        </td>
                    </tr>
                    <tr>
                        <th className="bg-success text-white">작성자</th>
                        <td>
                            {nickName}
                        </td>
                    </tr>
                    <tr>
                        <th className="bg-success text-white">내용</th>
                        <td style={{ height: "500px" }}>
                            <pre style={{ fontSize: "20px" }}>{content}</pre>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{ width: "100%", textAlign: "right" }}>
                {currentUserUid === uid &&
                    <>
                        <button className="btn btn-warning" onClick={handleBoardModifyClick}>수정</button>
                        <button className="btn btn-danger" onClick={handleBoardDeleteClick}>삭제</button>
                    </>
                }
                <button className="btn btn-secondary" onClick={handleBoardCancelClick}>취소</button>
            </div>

            <CustomModal isOpen={showModal} onClose={handleCloseModal} title="안내메시지">
                <p>{modalMessage}</p>
            </CustomModal>
        </>
    )
}

