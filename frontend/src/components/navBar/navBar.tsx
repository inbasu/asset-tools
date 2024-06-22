import { useContext } from 'react';
import { UserContext, user } from '../../App';
import { Link } from 'react-router-dom';

// MUI imports
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';





 export default function Navbar() {
     const user = useContext<user>(UserContext);
  return (
    <AppBar position="static" style={{height: "4vh", backgroundColor:"#002D72"}}>
      <Container >
              <Toolbar disableGutters>

            <Link to="/" >
                <h1>go home</h1>
            </Link>
                    <Typography variant="subtitle1" gutterBottom style={{fontSize: "1.3vh"}}>
                {user.username}
            </Typography>
                {(user.store_role.length > 0) ? // check user stores if exist
                    <Typography variant="subtitle2" display="block" gutterBottom>
                            ТЦ:({user.store_role.join(',')})
                    </Typography>
                    : <p></p>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
