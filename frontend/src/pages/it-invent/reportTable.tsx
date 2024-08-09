import { Fragment, useEffect, useState } from 'react';
import { formPlaceReport, formTillReport, Item, Report } from './data';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';

type params = {
        report: Report | null;
        items: Array<Item>;
        fields: Map<string, boolean>;
};


type Props = {
        reportName: string;
        label: string;
        items: Array<Item>;
        fields: Map<string, boolean>;
};

function ItemsRow({ label, items, fields, reportName }: Props) {

        const [open, setOpen] = useState(false);
        return (
                <Fragment>
                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell>
                                        <IconButton aria-label="expand" size="small" onClick={() => setOpen(!open)}>
                                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                </TableCell>
                                <TableCell>{label}</TableCell>
                                <TableCell>{items.length}</TableCell>
                        </TableRow>
                        <TableRow>
                                <TableCell style={{ padding: 0 }} colSpan={3}>
                                        <Collapse in={open} timeout="auto" unmountOnExit sx={{
                                                backgroundColor:
                                                        reportName === "По местам" ?
                                                                items.filter(item => item.Type === "MONITOR").length * 2 === items.length ? '#e8f5e9' : '#ffebee' :
                                                                "white"
                                        }}>
                                                <Box>
                                                        <Table size="small">
                                                                {items.map((item) => {
                                                                        return (
                                                                                <TableRow sx={{ backgroundColor: item.invented ? '#e8f5e9' : '#ffebee' }}>
                                                                                        {[...fields.keys()].map((key) => {
                                                                                                if (fields.get(key)) {
                                                                                                        return <TableCell>{item[key]}</TableCell>;
                                                                                                }
                                                                                        })}
                                                                                </TableRow>
                                                                        );
                                                                })}
                                                        </Table>
                                                </Box>
                                        </Collapse>
                                </TableCell>
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
                                break;
                        case 'По местам':
                                setItems(formPlaceReport(items));
                                break;
                }
        }, [report, items, fields]);

        return (
                <Table size="small" sx={{ border: '1px solid grey' }}>
                        {(reportItems ? [...reportItems.entries()] : []).map((one) => {
                                return <ItemsRow fields={fields} items={one[1]} label={one[0]} reportName={report?.name} />;
                        })}
                </Table>
        );
}
