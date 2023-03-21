import React, {useEffect, useState, useRef} from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatus = () => {
  
    const [loggedIn, setLoggedIn] = useState(false);
    const [changeStatus, setChangeStatus] = useState(true);
    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted){
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setLoggedIn(true);
                }
                setChangeStatus(false)
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    return {loggedIn, changeStatus}
}


