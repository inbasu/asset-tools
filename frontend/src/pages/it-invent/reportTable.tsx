import { Fragment, useEffect, useState } from 'react';
import { formPlaceReport, formTillReport, Item, Report } from './data';

import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

type params = {
  report: Report | null;
  items: Array<Item>;
  fields: Map<string, boolean>;
};

type Props = {
  loc: string;
  items: Array<Item>;
  fields: Map<string, boolean>;
};

function Row({ loc, items, fields }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {loc}
        </TableCell>
        <TableCell>{items.length}</TableCell>
      </TableRow>
      <TableRow>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Table size="small">
            {items.map((item) => {
              console.log(item);
              return (
                <TableRow sx={{ backgroundColor: item.invented === 'yes' ? '#e8f5e9' : '#ffebee', width: '100%' }}>
                  {[...fields.keys()].map((f) => {
                    if (fields.get(f)) {
                      return <TableCell>{item[f]}</TableCell>;
                    }
                  })}
                </TableRow>
              );
            })}
          </Table>
        </Collapse>
      </TableRow>
    </Fragment>
  );
}

export default function ReportTable({ items, report, fields }: params) {
  const [reportItems, setItems] = useState<Map<string, Array<Item>>>();
  useEffect(() => {
    switch (report?.name) {
      case 'Кассы':
        setItems(formTillReport(items));
        console.log(reportItems);
        break;
      case 'По местам':
        setItems(formPlaceReport(items));
        console.log(reportItems);
        break;
    }
  }, [report, items, fields]);

  return (
    <Table size="small">
      {(reportItems ? [...reportItems.entries()] : []).map((one) => {
        return <Row fields={fields} items={one[1]} loc={one[0]} />;
      })}
    </Table>
  );
}
