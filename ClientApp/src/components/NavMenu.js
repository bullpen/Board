import React, { useContext, useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import UserContext from './context/UserContext';
import './NavMenu.css';

export const NavMenu = (props) => {
    const { currentUserEmail, setCurrentUserEmail, setCurrentUserNickName, setCurrentUserUid, currentUserNickName } = useContext(UserContext);
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("api/account/session", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setCurrentUserEmail(data.email)
                    setCurrentUserNickName(data.nickname);
                    setCurrentUserUid(data.uid);
                } else {
                    setCurrentUserEmail("")
                    setCurrentUserNickName("");
                    setCurrentUserUid("0");
                }

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const handleLoginClick = () => {
        window.history.pushState(null, '', '/login');
        window.dispatchEvent(new Event('popstate'));
    }

    const handleLogoutClick = async () => {
        const response = await fetch("api/account/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status === 200) {
            setCurrentUserEmail("")
            setCurrentUserNickName("");
            setCurrentUserUid(0);
            window.history.pushState(null, '', '/login');
            window.dispatchEvent(new Event('popstate'));
        }
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                <NavbarBrand tag={Link} to="/">Board</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/board">Board</NavLink>
                        </NavItem>
                    </ul>
                </Collapse>

                {currentUserEmail === "" &&
                    <button className="btn btn-success btn-sm" onClick={handleLoginClick}>로그인</button>
                }

                {currentUserEmail !== "" &&
                    (
                        <>
                            <span style={{ backgroundColor: "#aff", padding: "3px", borderRadius: "5px" }}>
                                <span>{currentUserNickName}({currentUserEmail})님 안녕하세요!</span>
                            </span>
                            <button className="btn btn-primary btn-sm" onClick={handleLogoutClick}>로그아웃</button>
                        </>
                    )
                }
            </Navbar>

        </header>
    );
}

export default NavMenu;
