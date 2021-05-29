import createContainer from 'constate';
import { useState } from 'react';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoaing] = useState(true);

    return {
        isLoading,
        currentUser,
        setCurrentUser,
    };
};

export const [AuthProvider, useAuthContext] = createContainer(useAuth);
