import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomModal from '../common/Modal';

export const BoardWrite = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const { bid } = useParams();

    useEffect(() => {
        const loadView = async () => {
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
                }

            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (bid !== undefined && bid !== null) {
            loadView();
        }
    }, []);

    const handleBoardWriteClick = async () => {

        if (title.length < 5) {
            setModalMessage("제목을 5글자 이상 입력해주세요.")
            setShowModal(true);
            return;
        } else if (content.length < 5) {
            setModalMessage("내용을 5글자 이상 입력해주세요.")
            setShowModal(true);
            return;
        }


        const response = await fetch("api/board/write", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                content
            })
        });

        if (response.status === 200) {
            window.history.pushState(null, '', '/board');
            window.dispatchEvent(new Event('popstate'));
            return;
        } else if (response.status === 401) {
            setModalMessage("로그인을 하지 않아 글을 작성할 수 없습니다.");
            setShowModal(true);
        }
    }

    const handleBoardModifyClick = async () => {

        if (title.length <= 5) {
            setModalMessage("제목을 5글자 이상 입력해주세요.")
            setShowModal(true);
            return;
        } else if (content.length <= 5) {
            setModalMessage("내용을 5글자 이상 입력해주세요.")
            setShowModal(true);
            return;
        }

        const response = await fetch(`api/board/modify/${bid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                content
            })
        });

        if (response.status === 200) {
            const executeResult = await response.json();

            switch (executeResult.resultCode) {
                case 0:
                    window.history.pushState(null, '', `/boardview/${bid}`);
                    window.dispatchEvent(new Event('popstate'));
                    return;
                case 2001:
                    setModalMessage("해당글이 존재하지 않습니다.");
                    break;
                case 2003:
                    setModalMessage("자신이 작성한 글만 수정이 가능합니다.");
                    break;
                case 2004:
                default:
                    setModalMessage("오류가 발생했습니다. 고객센타에 연락해주시기 바랍니다.");
            }
        } else if (response.status === 401) {
            setModalMessage("로그인 후에 글을 수정하실 수 있습니다.");
        }

        setShowModal(true);
    }

    const handleBoardCancelClick = () => {
        window.history.pushState(null, '', '/board');
        window.dispatchEvent(new Event('popstate'));
    }

    const handleTitleOnChange = (event) => {
        setTitle(event.target.value);
    }

    const handleContentOnChange = (event) => {
        setContent(event.target.value);
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
                        <th className="bg-success text-white">제목</th>
                        <td>
                            <input type="text" className="form-control" placeholder="제목.." value={title} onChange={handleTitleOnChange} />
                        </td>
                    </tr>
                    <tr>
                        <th className="bg-success text-white">내용</th>
                        <td style={{ height: "500px" }}>
                            <textarea className="form-control" style={{ height: "100%" }} placeholder="내용.." value={content} onChange={handleContentOnChange}></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{ width: "100%", textAlign: "right" }}>
                {bid &&
                    <button className="btn btn-warning" onClick={handleBoardModifyClick}>수정</button>
                }

                {!bid &&
                    <button className="btn btn-primary" onClick={handleBoardWriteClick}>등록</button>
                }
                <button className="btn btn-secondary" onClick={handleBoardCancelClick}>취소</button>
            </div>

            <CustomModal isOpen={showModal} onClose={handleCloseModal} title="안내메시지">
                <p>{modalMessage}</p>
            </CustomModal>
        </>
    )
}

