import { Home } from "./components/Home";
import { Login } from "./components/account/Login";
import { Register } from "./components/account/Register";
import { Board } from "./components/board/Board";
import { BoardWrite } from "./components/board/BoardWrite";
import { BoardView } from "./components/board/BoardView";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    }
    ,
    {
        path: '/register',
        element: <Register />
    }
    ,
    {
        path: '/board',
        element: <Board />
    }
    ,
    {
        path: '/boardWrite/:bid?',
        element: <BoardWrite />
    }
    ,
    {
        path: '/boardView/:bid',
        element: <BoardView />
    }
];

export default AppRoutes;
