import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularSpinner from '../../components/spinner';

export default function Notify({ invent, setShowNotify }: { invent: string; setShowNotify: Dispatch<SetStateAction<Boolean>> }) {
  const [action, setAction] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [load, setLoad] = useState<Boolean>(false);
  // const [done, setDone] = useState<string>('');

  const handelActionChange = async (action: string) => {
    setAction(action);
    setLoad(true);
    axios.post('/it-invent/notify/mails/', { invent: invent, action: action }).then((response) => {
      setTo(response.data.To);
      setCc(response.data.Cc);
      setBody(response.data.body);
      setTitle(response.data.title);
      setLoad(false);
    });
  };
  const handleSend = () => {
    axios.post('/it-invent/notify/send/', { To: to, Cc: cc, title: title, body: body }).then(() => {
      // setDone('Done');
      console.log(1);
    });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5%', position: 'absolute', left: 'calc(50% - 450px)' }}>
      <IconButton aria-label="close" sx={{ position: 'absolute', right: '5px', top: '10%' }} onClick={() => setShowNotify(false)}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <Grid container spacing={2} sx={{ width: '900px', padding: 1, borderRadius: 2, backgroundColor: 'white' }} boxShadow={2}>
        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControlLabel
            labelPlacement="top"
            label={'Open'}
            control={<Radio size="small" value={'open'} checked={action == 'open'} onChange={(event) => handelActionChange(event.target.value)} />}
          />

          <FormControlLabel
            labelPlacement="top"
            label={'Start'}
            control={<Radio size="small" value={'start'} checked={action == 'start'} onChange={(event) => handelActionChange(event.target.value)} />}
          />
          <FormControlLabel
            labelPlacement="top"
            label={'Mobile'}
            control={<Radio size="small" value={'mobile'} checked={action == 'mobile'} onChange={(event) => handelActionChange(event.target.value)} />}
          />
          <FormControlLabel
            labelPlacement="top"
            label={'Temp'}
            control={<Radio size="small" value={'temp'} checked={action == 'temp'} onChange={(event) => handelActionChange(event.target.value)} />}
          />

          <FormControlLabel
            labelPlacement="top"
            label={'Close'}
            control={<Radio size="small" value={'close'} checked={action == 'close'} onChange={(event) => handelActionChange(event.target.value)} />}
          />
        </Grid>
        <Grid xs={2}>
          <Button color={'secondary'} sx={{ height: '100%', width: '100%' }} onClick={handleSend}>
            Send <ForwardToInboxIcon sx={{ padding: 1 }} />
          </Button>
        </Grid>
        <Grid xs={10} container>
          <Grid xs={2}>
            <Typography textAlign={'center'} variant="subtitle1">
              To:
            </Typography>
          </Grid>
          <Grid xs={10}>
            <TextField fullWidth size="small" variant="standard" multiline value={to} onChange={(event) => setTo(event.target.value)} />
          </Grid>
          <Grid xs={2}>
            <Typography textAlign={'center'} variant="subtitle1">
              Cc:
            </Typography>
          </Grid>
          <Grid xs={10}>
            <TextField fullWidth size="small" variant="standard" multiline value={cc} onChange={(event) => setCc(event.target.value)} />
          </Grid>
        </Grid>

        <Grid xs={12} pt={1}>
          <TextField id="msg-title" value={title} size="small" fullWidth onChange={(evetn) => setTitle(evetn.target.value)} />
        </Grid>
        <Grid xs={12} pt={1}>
          <TextField id="msg-body" value={body} rows={25} multiline fullWidth onChange={(evetn) => setBody(evetn.target.value)} />
        </Grid>
      </Grid>
      {load && <CircularSpinner />}
    </Box>
  );
}
