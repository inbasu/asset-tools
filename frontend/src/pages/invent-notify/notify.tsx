import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Notify() {
  const [action, setAction] = useState<string>('');
  const [to, setTo] = useState<Array<string>>([]);
  const [cc, setCc] = useState<Array<string>>([]);
  const [body, setBody] = useState<string>('');

  const handelActionChange = (action: string) => {
    setAction(action);
    setTo();
    setCc();
    setBody();
  };
  const handleSend = () => {
    console.log('123123123');
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5%' }}>
        <Grid container spacing={2} sx={{ width: '900px', padding: 1, borderRadius: 2 }} boxShadow={2}>
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
              <TextField fullWidth size="small" variant="standard" />
            </Grid>
            <Grid xs={2}>
              <Typography textAlign={'center'} variant="subtitle1">
                Cc:
              </Typography>
            </Grid>
            <Grid xs={10}>
              <TextField fullWidth size="small" variant="standard" />
            </Grid>
          </Grid>

          <Grid xs={12} pt={1}>
            <TextField id="msg-body" rows={25} multiline fullWidth onChange={(evetn) => setBody(evetn.target.value)} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
