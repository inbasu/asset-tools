import { useEffect, useState, ChangeEvent} from 'react';
import { Item, Report } from './data';
import CircularSpinner from '../../components/spinner';
// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Box from '@mui/material/Box';



const filterItems = (items: Array<Item>, filter?: Map<string, Array<string>>): Array<Item> => {
    if (items && filter &&  filter.size) {
        // yeah this is unreadable but inline
        // that is prefere coz of productivity
        return  items.filter((item: Item) => {
            return ([...filter]).map((one) => {
                return (one[1]).some((attr: string) => {
                    if (attr === "?") { return true }
                    else { return (item[one[0]].toLowerCase()).includes(attr.toLowerCase()) }
                })
            }).every((condi) => condi);
        })}
    return items
};
type Props = {
    parent_items: Array<Item>;
    fields: Map<string, boolean>;
    report: Report;
}
export default function ItemsTable({ parent_items, fields, report }: Props) {
    console.log(report)
    const [items, setItems] = useState<Array<Item>>(parent_items);
    const [filter, setFilter] = useState<Map<string, Array<string>>>(new Map([]));
    const [sortedOrder, setOrderBy] = useState<Set<string>>(new Set([]));
    const [load, setLoad] = useState<boolean>(false);

    const handleFilterChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        if (event.target.value) {
            filter.set(event.target.id, event.target.value.split('&'))
        } else {
            filter.delete(event.target.id)
        }
        setFilter(new Map(filter))
    }

    const handelSort = (key: string) => {   
        if (sortedOrder.has(key)) {
            items.sort((a, b) => a[key] > b[key] ? 0 : -1)
            sortedOrder.delete(key)
        } else {
            items.sort((a, b) => a[key] < b[key] ? 0 : -1)
            sortedOrder.add(key)
        }
        setOrderBy(sortedOrder)
        setItems([...items])
    }
    useEffect(() => {
        setLoad(true);
        let tmp = filterItems(parent_items, filter)
        setItems(tmp);
        setLoad(false);
    }, [fields, filter, parent_items])

    return (
    <Box width={"100%"}>
    {(load) && <CircularSpinner />}     
    {(parent_items.length!=0) &&
    <TableContainer component={Paper} sx={{marginTop: "2vh", width: "100%"}}>
      <Table sx={{ minWidth: 650,}} aria-label="simple table" size='small'>
        <TableHead>
            <TableRow>
                      {fields && [...fields.keys()].map((key) => {
                          if (fields.get(key)) {
                              return (
                                <TableCell>
                                      <TextField fullWidth id={key} label={key} variant="standard" size='small' onChange={(event) => handleFilterChange(event)}
                                          InputProps={{
                                              endAdornment: (
                                                <IconButton sx={{ position: 'absolute', right: "0%" }} onClick={() => handelSort(key)} ><SwapVertIcon /></IconButton>
                                      )}}
                                        
                                      />
                              </TableCell>)
                          }
                      } 
                )}      
          </TableRow>
                        </TableHead>
                        {(items) &&
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow   >
                                        {fields && [...fields.keys()].map((key) => {
                                            if (fields.get(key)) {
                                                return (<TableCell>{item[key]}</TableCell>)
                                            }
                                        }
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        }
      </Table>
    </TableContainer>}
    </Box>
  );
}
