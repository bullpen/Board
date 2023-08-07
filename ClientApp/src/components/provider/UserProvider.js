import React, { useState } from 'react';
import UserContext from '../context/UserContext'

const UserProvider = ({ children }) => {
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [currentUserUid, setCurrentUserUid] = useState(0);
    const [currentUserNickName, setCurrentUserNickName] = useState("");

    return (
        <UserContext.Provider value={{ currentUserEmail, setCurrentUserEmail, currentUserUid, setCurrentUserUid, currentUserNickName, setCurrentUserNickName }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;