import NotificationWithButton from '../../components/notifications/alertWithButton';
import { useEffect, useState } from 'react';
import { Item, Store, Location, User } from './data';
import NotificationSuccess from '../../components/notifications/allGood';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import { TextField } from '@mui/material';

const actions: Map<string, string> = new Map([
  ['takeback', 'Сдать'],
  ['giveaway', 'Выдать'],
  ['giveawayIT', 'Выдать'],
  ['send', 'Переслать'],
]);

type Props = {
  item: Item | undefined;
  action: string;
};
const l: number = 4;

export default function Card({ item, action }: Props) {
  const [store, setStore] = useState();
  const [location, setLocation] = useState();
  const [user, setUser] = useState();
  const [code, setCode] = useState();
  const [blank, setBlank] = useState();
  const [resp, setResp] = useState<string>('');
  const [alert, setAlert] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>(false);

  const handleDownload = () => {};
  const handleRequest = () => {};

  useEffect(() => {}, [blank, store, location, user]);

  const storeField = () => {
    return <></>;
  };
  const locationField = () => {};
  const userField = () => {};

  const renderProps = () => {
    var props: Array<string> = [];
    switch (action) {
      case 'giveaway':
        props = [];
        break;
      case 'gieawayIT':
        props = [];
        break;
      case 'takeback':
        props = [];
        break;
      case 'send':
        props = [];
    }
    return (
      <>
        {props.map((prop) => {
          return (
            <Grid container>
              <Grid item xs={l}>
                {prop}
              </Grid>
              <Grid item xs={12 - l}>
                {item ? item[prop] : ''}
              </Grid>
            </Grid>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Grid container spacing={1} p={1}>
        <Grid container xs={12}>
          {renderProps()}
          {action === 'send' ? storeField() : <></>}
        </Grid>
        <Grid item xs={3}>
          {action === 'send' ? (
            <TextField size="small" label="ТЦ" fullWidth></TextField>
          ) : (
            <Button color="secondary" onClick={handleDownload}>
              Скачать бланк
              <DownloadIcon />
            </Button>
          )}
        </Grid>
        <Grid item xs={6.5}>
          {action == 'send' ? <TextField size="small" label="Код" fullWidth></TextField> : <Button></Button>}
        </Grid>
        <Grid item xs={2.5}>
          <Button variant="contained" onClick={handleRequest} fullWidth>
            {actions.get(action)}
            <SendIcon />
          </Button>
        </Grid>
      </Grid>
      {alert && <NotificationWithButton text={resp} setAlert={setAlert} data={new Map([['item', JSON.stringify(item)]])} />}
      {success && <NotificationSuccess text={resp} setAlert={setSuccess} />}
    </>
  );
}
