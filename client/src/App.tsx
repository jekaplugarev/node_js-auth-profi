import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/response/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const {store} = useContext(Context)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    const getUsers = async () => {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <LoginForm/>
        )
    }

    return (
        <div>
            <h2>
                {store.isAuth ?
                    `Пользователь авторизован ${store.user.email}`
                    : 'Авторизуйтесь'}
            </h2>
            <h2>
                {store.user.isActivated ?
                    'Аккаунт подтвержден'
                    : 'Подтвердите аккаунт на почте'
                }
            </h2>
            <button
                onClick={() => store.logout()}
            >
                Выйти
            </button>
            <button
                onClick={() => getUsers()}
            >
                Получить пользователей
            </button>
            <div>
                {users.map(user =>
                    <div key={user.id}>
                        {user.email}
                    </div>
                )}
            </div>
        </div>
    );
}

export default observer(App);
