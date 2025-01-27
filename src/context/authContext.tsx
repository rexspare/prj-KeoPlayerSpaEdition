import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
    setUser: React.Dispatch<React.SetStateAction<any>>;
    user: any;
    getUser: React.Dispatch<any>
}

export const AuthContext = createContext<AuthContextProps>({
    setUser: () => { },
    user: {},
    getUser: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);


    useEffect(() => {
        if (user) {
            getUser();
        }
    }, [user]);

    const getUser = async () => {

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                getUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
