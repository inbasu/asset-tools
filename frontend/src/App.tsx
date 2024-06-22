
import Router from "./router"
import { createContext } from "react"


export interface user {
  username: string,
  email: string,
  roles: Array<string>,
  store_role: Array<string|number>,
}

// Get user once and sharre it across app
export const UserContext = createContext<user>({
  username: 'ivan.fisenko',
  email: '',
  roles: ['one', 'two'],
  store_role: [1012, 1014],
});



function App() {
  const user = {
    username: 'ivan.fisenko',
    email: '',
    roles: ['one', 'two'],
    store_role: [1012, 1014],
  };


  return (
    <>
      {(user !== null) && 
        <UserContext.Provider value={user}>
          <Router />
        </UserContext.Provider>
      }
    </>
    
  )
}

export default App
