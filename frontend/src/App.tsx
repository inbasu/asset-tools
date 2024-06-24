
import Router from "./router"
import { createContext } from "react"


export interface user {
  username: string,
  email: string,
  roles: Array<string>,
  store_role: Array<string>,
}

// Get user once and sharre it across app
export const UserContext = createContext<user>({
  username: 'ivan.fisenko',
  email: '',
  roles: ['MCC_RUINSIGHT_IT_ROLE', 'MCC_RU_INSIGHT_QA_ROLE', 'MCC_RU_INSIGHT_IT_INVENTADMIN_ROLE'],
  store_role: ["1012", "1014"],
});



function App() {
  const user = {
    username: 'ivan.fisenko',
    email: '',
    roles: ['MCC_RUINSIGHT_IT_ROLE', 'MCC_RU_INSIGHT_QA_ROLE', 'MCC_RU_INSIGHT_IT_INVENTADMIN_ROLE'],
    store_role: ["1012", "1014"],
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
