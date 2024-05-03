import { createContext, useState } from "react";
import axiosInstance from "../helpers/axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const getLocalStorageItem = localStorage.getItem('authTokens');
    const [user, setUser] = useState(() => getLocalStorageItem ? jwtDecode(JSON.parse(getLocalStorageItem).access) : null);
    const [token, setToken] = useState(() => getLocalStorageItem ? JSON.parse(getLocalStorageItem) : null);
    const [errMsg, setErrMsg] = useState('');
    const [IsLoading, setIsLoading] = useState(true);

    const loginUser = async (data) => {
        // To cancel axios request
        const controller = new AbortController();

        try {
            const response = await axiosInstance.post('authentication/login/', {
                "email": data.email,
                "password": data.password,
            }, {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log(response.data)
            // console.log(jwtDecode(response.data.access))
            setToken(response.data)
            setUser(jwtDecode(response.data.access))
            localStorage.setItem('authTokens', JSON.stringify(response.data))
        }
        catch (err) {
            console.error(err);
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized access')
            } else {
                setErrMsg('Login Failed')
            }
        }

        // cancels axios request if there is any
        return () => {
            controller.abort();
        }
    }

    const logoutUser = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        window.location.href = '/'
    }

    const contextData = {
        user: user,
        token: token,
        errMsg: errMsg,
        setUser: setUser,
        loginUser: loginUser,
        setToken: setToken,
        logoutUser: logoutUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}