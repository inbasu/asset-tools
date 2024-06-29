// import axios from 'axios'
import Router from './router';
import { createContext, useEffect, useState } from 'react';
import CircularSpinner from './components/spinner';

export interface user {
  username: string;
  email: string;
  roles: Array<string>;
  store_role: Array<string>;
}

const baseUser: user = {
  username: '',
  email: '',
  roles: [],
  store_role: [],
};
// Get user once and sharre it across app
export const UserContext = createContext<user>(baseUser);

const getUser = async () => {
  return {
    username: 'test.user',
    email: 'some@domen.zz',
    roles: ['MCC_RU_INSIGHT_IT_ROLE'],
    store_role: [],
  };
  // try {
  //   const responce = await axios.get('/auth/whoami/')
  //   return responce.data
  // } catch (error) {console.log(error)}
};

function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<user | undefined>();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const tmp: user = await getUser();
      setUser(tmp);
    })();
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <CircularSpinner />}
      {user && (
        <UserContext.Provider value={user}>
          <Router />
        </UserContext.Provider>
      )}
    </>
  );
}

export default App;
