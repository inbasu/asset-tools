import NotificationWithButton from '../../components/notifications/alertWithButton';
import { useState } from 'react';
import { Item } from './data';
import NotificationSuccess from '../../components/notifications/allGood';
import Grid from '@mui/material/Grid';

type Props = {
  item: Item;
  action: string;
};

export default function Card({ item, action }: Props) {
  const [blank, setBlank] = useState();
  const [resp, setResp] = useState<string>('');
  const [alert, setAlert] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>(false);

  const handleDownload = () => {};
  const handleRequest = () => {};

  const renderCard = () => {
    switch (action) {
      case 'giveaway':
        break;
      case 'gieawayIT':
        break;
      case 'takeback':
        break;
      case 'send':
        break;
        return <div></div>;
    }
  };
  return (
    <>
      <Grid container spacing={}>
        <Grid container xs={12}>
          {renderCard()}
        </Grid>
        <Grid xs={2}>
          <button></button>
        </Grid>
        <Grid>
          <Button></Button>
        </Grid>
        <Grid>
          <Buton></Buton>
        </Grid>
      </Grid>
      {renderCard()}
      {alert && <NotificationWithButton text={resp} setAlert={setAlert} data={new Map([['item', JSON.stringify(item)]])} />}
      {success && <NotificationSuccess text={resp} setAlert={setSuccess} />}
    </>
  );
}
