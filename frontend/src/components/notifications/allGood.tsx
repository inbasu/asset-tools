import { Alert } from '@mui/material';
type Props = {
  text: string;
  setAlert: Function;
};

export default function NotificationSuccess({ text, setAlert }: Props) {
  return (
    <Alert severity="error" style={{ position: 'absolute', bottom: '15%' }} onClose={() => setAlert(false)}>
      {text}
    </Alert>
  );
}
