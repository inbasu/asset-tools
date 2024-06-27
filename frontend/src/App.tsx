import axios from "axios";
import Router from "./router"
import { createContext, useEffect, useState } from "react"


export interface user {
  username: string,
  email: string,
  roles: Array<string>,
  store_role: Array<string>,
}

const baseUser: user = {
  username: '',
  email: '',
  roles: [],
  store_role: [],
}
// Get user once and sharre it across app
export const UserContext = createContext<user>(baseUser);

const getUser = async () => {
  try {
    const responce = await axios.get('/auth/whoami/')
    return responce.data
  } catch (error) {console.log(error)}
}



function App() {
  
  const [user, setUser] = useState<user|undefined>();

  useEffect(() => {
    (async () => {
      const tmp: user = await getUser()
      setUser(tmp)
    })()
  }, [])


  return (
    <>
      {(user) && 
        <UserContext.Provider value={user}>
          <Router />
        </UserContext.Provider>
      }
    </>
    
  )
}

export default App
