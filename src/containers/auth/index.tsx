import createContainer from 'constate';
import {createContext, useState} from 'react';

type User = {
    id?: string;
    username?: string;
    permissions?: string[];
}

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User>({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (user) => {
      setCurrentUser(user);
      setIsLoggedIn(true);
    };

    const logout = () => {
        setCurrentUser({});
        setIsLoggedIn(false);
    };

    const can = (permission: string): boolean => {
        return isLoggedIn && currentUser.permissions!.includes(permission);
    }

    return {
        can,
        login,
        logout,
        currentUser,
        isLoggedIn,
    };
};

export const [AuthProvider, useAuthContext] = createContainer(useAuth);
