import NotificationWithButton from '../../components/notifications/alertWithButton';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Item, Store, Location, User } from './data';
import NotificationSuccess from '../../components/notifications/allGood';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import { TextField, Typography } from '@mui/material';
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
  handleParentItem: Function;
};
const l: number = 4;

const getLocation = (items: Array<Location>, name: any) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].Name === name) {
      return items[i];
    }
  }
};
const getStore = (items: Array<Store>, name: any) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].Name === name) {
      return items[i];
    }
  }
};

const getUser = (users: Array<User>, user: string) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].Email === user) {
      return users[i];
    }
  }
};
export default function Card({ item, action, stores, locations, handleParentItem }: Props) {
  const [store, setStore] = useState<string | null>(item ? item.Store : null);
  const [location, setLocation] = useState<string | null>(item ? item.Location : null);
  const [user, setUser] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<User>>([]);
  const [code, setCode] = useState<string>('');
  const [itreq, setItreq] = useState<string>('');
  const [blank, setBlank] = useState<File | null>(null);
  const [validBlank, setValidBlank] = useState<Boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [canBeSend, setCanBeSend] = useState<boolean>(false);
  const [disableDownload, setDisableDownload] = useState<boolean>(false);
  const abortControlerRef = useRef<AbortController>();

  const handleDownload = () => {
    setDisableDownload(true);
    axios
      .post('/mobile/download_blank/', { item: item, action: action })
      .then((response) => response.data)
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${item?.name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .finally(() => setDisableDownload(false));
  };
  const handleRequest = () => {
    const selectedStore = store ? getStore(stores, store) : '';
    const selectedLocation = location ? getLocation(locations, location) : '';
    const selectUser = user ? getUser(users, user) : '';
    setLoading(true);
    var formData = new FormData();
    formData.append('file', blank ? blank : '');
    formData.append('store', selectedStore ? selectedStore.Key : '');
    formData.append('location', selectedLocation ? selectedLocation.Key : '');
    formData.append('code', code);
    formData.append('user', selectUser ? selectUser.Key : '');
    formData.append('itreq', itreq);
    axios
      .post('/mobile/handle_user_action/', formData)
      .then((response) => {
        if (response.data.error) {
          setResponse(response.data.error);
          setAlert(true);
        } else {
          setResponse(response.data.result);
          setSuccess(true);
        }
        handleParentItem(item);
      })
      .finally(() => setLoading(false));
  };

  const handleUpload = (file: File | null) => {
    if (file !== null && file.size / 1024 < 768 && ['.pdf', '.jpg', '.jpeg', '.png'].some((suf) => file.name.endsWith(suf))) {
      setBlank(file);
      setValidBlank(true);
    } else {
      setValidBlank(false);
      setBlank(null);
    }
  };
  useEffect(() => {
    setStore(item ? item.Store : null);
    setLocation(item ? item.Location : null);
    setUser(null);
    setBlank(null);
  }, [item]);
  useEffect(() => {
    if ((action === 'send' && store) || ((action === 'takeback' || action === 'giveaway') && validBlank) || (action === 'giveawayIT' && store && location && user)) {
      setCanBeSend(true);
    } else {
      setCanBeSend(false);
    }
  }, [blank, store, location, user]);
  useEffect(() => {
    if (abortControlerRef.current) {
      abortControlerRef.current.abort();
    }
    const controller = (abortControlerRef.current = new AbortController());
    const signal = controller.signal;
    const iql: string = `"Email" LIKE ${user?.split(' | ')[-1]} OR "ФИО"${user?.split(' | ')[-1]} LIKE AND "Status" = "Active"`;
    axios.post('/mobile/it_iql/', { iql: iql, item_type: 'AD_User' }, { signal: signal }).then((response) => setUsers(response.data));
  }, [user]);

  const AutocompliteField = (items: Array<string> | undefined, value: string | null, setValue: Function, label: string) => {
    return (
      <Autocomplete
        options={items ? items : []}
        id="store-box"
        autoHighlight
        value={value ? value : ''}
        onChange={(_, value) => setValue(value)}
        renderInput={(params) => <TextField {...params} fullWidth label={label} size="small" />}
      />
    );
  };

  const renderProps = () => {
    var props: Array<string> = [];
    switch (action) {
      case 'giveaway':
        props = ['Инв No и модель', 'inv.', 'Store', 'Комментарий', 'For user'];
        break;
      case 'giveawayIT':
        props = ['INV No', 'Serial No', 'Model', 'State'];
        break;
      case 'takeback':
        props = ['INV No', 'Serial No', 'Model', 'State', 'Location', 'User'];
        break;
      case 'send':
        props = ['INV No', 'Serial No', 'Model', 'State', 'Store', 'Location'];
    }
    return (
      <>
        {props.map((prop) => {
          return (
            <Grid container p={2}>
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
        <Grid item xs={12}>
          <b>{item ? item.Name : ''}</b>
        </Grid>
        {renderProps()}
        {action === 'giveawayIT' && locations && stores ? (
          <Grid container p={2} spacing={1}>
            <Grid item xs={l} sx={{}}>
              Store
            </Grid>
            <Grid item xs={11.5 - l}>
              {AutocompliteField(location ? getLocation(locations, location)?.Store : stores.map((s) => s.Name), store, setStore, '')}
            </Grid>
            <Grid item xs={l} sx={{}}>
              Location
            </Grid>
            <Grid item xs={11.5 - l}>
              {AutocompliteField(store ? locations.flatMap((l) => (l.Store?.includes(store) ? l.Name : [])) : locations.map((l) => l.Name), location, setLocation, '')}
            </Grid>
            <Grid item xs={l} sx={{}}>
              User
            </Grid>
            <Grid item xs={11.5 - l}>
              {AutocompliteField(
                users.map((u) => `${u['Store Insight']} | ${u['ФИО']} | ${u.Email}`),
                user,
                setUser,
                ''
              )}
            </Grid>
            <Grid item xs={l} sx={{}}>
              ITREQ
            </Grid>
            <Grid item xs={11.5 - l}>
              <TextField size="small" onChange={(event) => setItreq(event.target.value)} fullWidth type="number" />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <Grid item xs={3}>
          {action === 'send' ? (
            AutocompliteField(
              stores.map((s) => s.Name),
              store,
              setStore,
              'ТЦ'
            )
          ) : (
            <Button color="secondary" onClick={handleDownload} disabled={disableDownload}>
              Скачать бланк
              <DownloadIcon />
            </Button>
          )}
        </Grid>
        <Grid item xs={6}>
          {action == 'send' ? (
            <TextField size="small" label="Трек код" onChange={(event) => setCode(event.target.value)} fullWidth></TextField>
          ) : (
            <>
              <Button variant="outlined" endIcon={<FileUploadIcon />} component="label" color={validBlank ? 'success' : 'error'} fullWidth>
                {blank ? blank.name : 'Выберите файл'}
                <HiddenInput type="file" onChange={(event) => handleUpload(event.target.files ? event.target.files[0] : null)} />
              </Button>
              {!validBlank && (
                <Typography textAlign={'center'} variant="subtitle2" color={'error'}>
                  Файл в формате .pdf размером менее 0.5мб
                </Typography>
              )}
            </>
          )}
        </Grid>
        <Grid item xs={2.5}>
          <Button variant="contained" onClick={handleRequest} fullWidth disabled={!canBeSend}>
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
