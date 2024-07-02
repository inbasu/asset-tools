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
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const HiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'insert(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
});

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
  const [store, setStore] = useState<Store | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Array<User>>([]);
  const [code, setCode] = useState<string>('');
  const [itreq, setItreq] = useState<string>('');
  const [blank, setBlank] = useState<File | null>(null);
  const [validBlank, setValidBlank] = useState<Boolean>(false);
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

  const handleUpload = (file: File | null) => {
    if (file !== null && file.size / 1024 < 768 && ['.pdf', '.jpg', '.jpeg', '.png'].some((suf) => file.name.endsWith(suf))) {
      setBlank(file);
      setValidBlank(true);
    } else {
      setValidBlank(false);
    }
  };
  useEffect(() => {
    console.log(store);
    console.log(blank);
  }, [blank, store, location, user]);
  useEffect(() => {}, [user]);

  const AutocompliteField = (items: Array<Store | Location | User>, value: User | Store | Location | null, setValue: Function, label: string) => {
    return (
      <Autocomplete
        options={items}
        id="store-box"
        autoHighlight
        value={value}
        onChange={(event, value) => setValue(value)}
        renderInput={(params) => <TextField {...params} fullWidth label={label} size="small" />}
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
        <Grid container xs={12} spacing={1} p={1}>
          {renderProps()}

          {action == 'giveawayIT' ? (
            <>
              <Grid item xs={3} sx={{}}>
                Store
              </Grid>
              <Grid item xs={8}>
                {AutocompliteField(stores, store, setStore, '')}
              </Grid>
              <Grid item xs={3} sx={{}}>
                Location
              </Grid>
              <Grid item xs={8}>
                {AutocompliteField(locations, location, setLocation, '')}
              </Grid>
              <Grid item xs={3} sx={{}}>
                User
              </Grid>
              <Grid item xs={8}>
                {AutocompliteField(users, user, setUser, '')}
              </Grid>
              <Grid item xs={3} sx={{}}>
                ITREQ
              </Grid>
              <Grid item xs={8}>
                <TextField size="small" onChange={(event) => setItreq(event.target.value)} fullWidth type="number" />
              </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
        <Grid item xs={3}>
          {action === 'send' ? (
            AutocompliteField(stores, store, setStore, 'ТЦ')
          ) : (
            <Button color="secondary" onClick={handleDownload}>
              Скачать бланк
              <DownloadIcon />
            </Button>
          )}
        </Grid>
        <Grid item xs={6}>
          {action == 'send' ? (
            <TextField size="small" label="Трек код" onChange={(event) => setCode(event.target.value)} fullWidth></TextField>
          ) : (
            <Button variant="outlined" endIcon={<FileUploadIcon />} component="label" color={validBlank ? 'success' : 'error'} fullWidth>
              {blank ? blank.name : 'Выберите файл'}
              <HiddenInput type="file" onChange={(event) => handleUpload(event.target.files ? event.target.files[0] : null)} />
            </Button>
          )}
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
