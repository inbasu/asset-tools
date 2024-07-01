import { user, UserContext } from '../../App';
import { useContext, useEffect, useRef, useState } from 'react';
import { Item, Store, Location } from './data';
import Card from './card';
import axios from 'axios';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import NotificationWithButton from '../../components/notifications/alertWithButton';
import CircularSpinner from '../../components/spinner';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const l: number = 3.5;
const border: string = 'solid #D3D3D3 1px';
const searchLabels: Map<string, string> = new Map([
  ['takeback', 'Введите номер оборудования или фамилию пользователя(на английском)'],
  ['giveaway', 'Введите номер реквеста вида ITREQ-000000'],
  ['giveawayIT', 'Введите номер оборудования'],
  ['send', ''],
]);

const resultProps: Array<string> = [];
// import Box from '@mui/material/Box';

export default function Mobile() {
  const user: user = useContext(UserContext);
  const [action, setAction] = useState<string>(''); // make it reducer
  const [querry, setQuerry] = useState<string>('');
  const [stores, setStores] = useState<Store>();
  const [locs, setLocks] = useState<Location>();
  const [item, setItem] = useState<Item | undefined>();
  const [items, setItems] = useState<Array<Item>>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [alert, setAlert] = useState(false);
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    if (user.roles.includes('MCC_RU_INSIGHT_IT_ROLE')) {
      axios.post('/', { itemType: 'Store', iql: 'Name IS NOT empty' }).then((response) => setStores(response.data));
      axios.post('/', { itemType: 'Location', iql: 'Name IS NOT empty and "Store" IS NOT empty' }).then((response) => setLocks(response.data));
    }
    document.title = 'Mobile invent';
  }, []);

  useEffect(() => {
    if (abortControllerRef && abortControllerRef.current) {
      abortControllerRef.current?.abort('');
    }
    setLoading(true);
    if (querry.length > 3) {
      const controller = (abortControllerRef.current = new AbortController());
      const signal = controller.signal;
      axios.post('', { querry: querry }, { signal: signal }).then((response) => {
        response.data.result ? setItems(response.data.result) : setAlert(true);
      });
    } else if (action === 'send') {
    }
    setLoading(false);
  }, [querry, action]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0, height: '96vh', width: '100%' }}>
        <Grid container sx={{ boxShadow: 8, height: '86vh', width: '84%' }} spacing={1}>
          <Grid item xs={l} sx={{ borderRight: border, paddingRight: 1, borderBlockEnd: border }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Выберите действие</InputLabel>
              <Select label="Выберите действие" value={action} id="action-select" onChange={(event) => setAction(event.target.value)} sx={{ width: '100%' }}>
                <MenuItem value={'giveaway'}>Выдать по реквесту</MenuItem>
                {user && <MenuItem value={'giveawayIT'}>Выдать Оборудование</MenuItem>}
                <MenuItem value={'takeback'}>Сдать</MenuItem>
                <MenuItem value={'send'}>Переслать</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12 - l} pr={1} sx={{ borderBlockEnd: border }}>
            <TextField
              id="search-field"
              fullWidth
              label={action ? searchLabels.get(action) : ''}
              value={querry}
              onChange={(event) => setQuerry(event.target.value)}
              disabled={action == 'send' || !action}
            />
          </Grid>
          <Grid xs={l} sx={{ borderRight: border }}>
            <Table>
              {[...items].map((item: Item) => {
                return (
                  <TableRow onClick={() => setItem(item)} sx={{ background: '#D3D3D3', '&:hover': { background: '' } }}>
                    <Grid container>
                      <Grid item xs={12}>
                        item.Name
                      </Grid>
                      {resultProps.map((prop) => {
                        if (item.prop) {
                          return (
                            <Grid container spacing={1}>
                              <Grid>{prop}</Grid>
                              <Grid>{item[prop]}</Grid>
                            </Grid>
                          );
                        }
                      })}
                    </Grid>
                  </TableRow>
                );
              })}
            </Table>
          </Grid>
          <Grid item xs={12 - l}>
            <Card item={item} action={action} />
          </Grid>
        </Grid>
        {loading && <CircularSpinner />}
        {alert && (
          <NotificationWithButton
            text="По запросу ничего не найдено"
            setAlert={setAlert}
            data={
              new Map([
                ['action', action],
                ['querry', querry],
                ['user', JSON.stringify(user)],
              ])
            }
          />
        )}
      </Box>
    </>
  );
}
