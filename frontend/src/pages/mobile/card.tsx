import NotificationWithButton from '../../components/notifications/alertWithButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Item, Store, Location, User } from './data';
import NotificationSuccess from '../../components/notifications/allGood';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import { TextField } from '@mui/material';
import CircularSpinner from '../../components/spinner';
import Autocomplete from '@mui/material/Autocomplete';

const actions: Map<string, string> = new Map([
  ['takeback', 'Сдать'],
  ['giveaway', 'Выдать'],
  ['giveawayIT', 'Выдать'],
  ['send', 'Переслать'],
]);

type Props = {
  item: Item | undefined;
  action: string;
  stores: Array<Store>;
  locations: Array<Location>;
};
const l: number = 4;

export default function Card({ item, action, stores, locations }: Props) {
  const [store, setStore] = useState<Store | null>();
  const [location, setLocation] = useState<Location>();
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<Array<User>>();
  const [code, setCode] = useState<string>('');
  const [itreq, setItreq] = useState<string>('');
  const [blank, setBlank] = useState();
  const [response, setResponse] = useState<string>('');
  const [alert, setAlert] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);

  const handleDownload = () => {};
  const handleRequest = () => {
    setLoading(true);
    var formData = new FormData();
    formData.append('blank', blank ? blank : '');
    formData.append('store', store ? store.Key : '');
    formData.append('location', location ? location.Key : '');
    formData.append('code', code);
    formData.append('user', user ? user.Key : '');
    formData.append('itreq', itreq);
    axios.post('/', formData);
    setLoading(false);
  };

  useEffect(() => {
    console.log(store);
  }, [blank, store, location, user]);
  useEffect(() => {}, [user]);

  const StoreField = () => {
    return (
      <Autocomplete
        options={stores}
        id="store-box"
        autoHighlight
        value={store}
        onChange={(event, value) => setStore(value)}
        renderInput={(params) => <TextField {...params} label="ТЦ" size="small" />}
      />
    );
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
        </Grid>
        <Grid item xs={3}>
          {action === 'send' ? (
            StoreField()
          ) : (
            <Button color="secondary" onClick={handleDownload}>
              Скачать бланк
              <DownloadIcon />
            </Button>
          )}
        </Grid>
        <Grid item xs={6.5}>
          {action == 'send' ? <TextField size="small" label="Трек код" onChange={(event) => setCode(event.target.value)} fullWidth></TextField> : <Button></Button>}
        </Grid>
        <Grid item xs={2.5}>
          <Button variant="contained" onClick={handleRequest} fullWidth>
            {actions.get(action)}
            <SendIcon />
          </Button>
        </Grid>
      </Grid>
      {loading && <CircularSpinner />}
      {alert && <NotificationWithButton text={response} setAlert={setAlert} data={new Map([['item', JSON.stringify(item)]])} />}
      {success && <NotificationSuccess text={response} setAlert={setSuccess} />}
    </>
  );
}
