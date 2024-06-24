import { useContext, useState } from 'react';
import { UserContext, user } from '../../App';
import { Link } from 'react-router-dom';

// MUI imports
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import logo from '../../assets/logo.svg';

// Управление материальными активами компании


 export default function Navbar() {
   const user = useContext<user>(UserContext);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
   };
   
    const handleClose = () => {
      setAnchorEl(null);
    };

     return (
      <AppBar position="static" sx={{backgroundColor:"#003B7E", height: "4vh"}}>
        <Toolbar variant="dense" sx={{ flexGrow: 1, padding: 0, height: "4vh"}}>
                <Link to="/">
             <img src={logo} alt="Metro" style={{height: "4vh", maxHeight: "4vh", position: 'absolute', left:'0vw', top: '0'}} />
                  <Typography display="block" variant="caption" noWrap={ true }  fontSize={"1.6vh"} sx={{maxHeight: "4vh", position:"absolute", top: "0.65vh", left:"4.6vh" , color:"white", overflowX: 'hidden'}} gutterBottom>
                      Управление материальными активами компании
                  </Typography>
                </Link>
                <div onClick={handleClick} style={{height: "5vh",  position: 'absolute', right:'0.3vw', top: '0' ,textAlign: 'right'}} >
                    <Typography variant="subtitle2" gutterBottom m={0} fontSize={"1.3vh"}>
                        <b>{user.username}</b>
                    </Typography>
                    <Typography variant="caption" display="block" m={0} fontSize={"1vh"} gutterBottom>
                        {(user.store_role.length)? <i>ТЦ:({user.store_role.join(', ')})</i>:<i> </i>}
                    </Typography>
                  </div>
                  <Menu
                      sx={{ mt: 0, mr: 0, p: 0, borderRadius: 0 }}
                      id="menu-navbar"
                      anchorEl={anchorEl}
                      keepMounted      
                      open={open}
                      onClose={handleClose}
                      TransitionComponent={Fade}>
                  <MenuItem>
                  <Tooltip title={<div style={{ whiteSpace: 'pre-line' }}>{user.roles.join("\n")}</div>} placement="left-start">
                    <Typography variant="caption" textAlign="right" fontSize={"1.2vh"}>Roles</Typography>
                  </Tooltip>

                      </MenuItem>
                      <MenuItem onClick={() => { location.href = "/auth/logout" }}>
                        <Typography variant="caption" textAlign="right" fontSize={"1.2vh"}>Logout</Typography>
                      </MenuItem>
                    </Menu>
        </Toolbar>
      </AppBar>
  );
}



