import { useEffect, useContext, useState, Fragment, ChangeEvent } from "react";
import { UserContext, user } from "../App";
import axios from "axios";
import CircularSpinner from "../components/spinner";
import { Invent, Item, reports, filters } from "../components/it-invent/data";
import { test_items } from "../components/it-invent/test";
// MUI
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableViewIcon from '@mui/icons-material/TableView';
import CloseIcon from '@mui/icons-material/Close';
import ItemsTable from "../components/it-invent/table";




const invs: Array<Invent> = [
    { key:'1', name: '123', store: '1014' },
    { key:'2', name: "321", store: '1012' },
]



export default function ItInvent() {
    const user = useContext<user>(UserContext);
    const [load, setLoad] =  useState<Boolean>(false);
    const [invents, setInvents] = useState<Array<Invent>>([]);
    const [inventory, setInventory] = useState<Invent>();
    const [items, setItems] = useState<Array<Item>>([]);
    const [shownItems, setShown] = useState<Array<Item>>([]);
    const [showFilter, setShowFilters] = useState<Boolean>(false);
    const [fields, setFields] = useState<Map<string, boolean>>(filters);
    const [report, setReport] = useState(reports[0]);
    const [toPrint, setToPrint] = useState<Array<Item>>([]);

    // states
    const handleSelectInvent = (event: SelectChangeEvent<string|null>) => {
        for (let i = 0; i < invents.length; i++) {
            if (invents[i].key == event.target.value) {
                setInventory(invents[i]);
            }
        };
        
    };

    const handleChangeFilter = (event: ChangeEvent<HTMLInputElement>) => {
        filters.set(event.target.value, !fields.get(event.target.value))
        setFields(new Map(filters)) // here need to create new map coz useState dosnt see changes if it in mutable
    };


    const requestInventItems = () => {
        setLoad(true);
        setItems(test_items);
        setShown(test_items)
        setLoad(false);
    };

    // effects
    useEffect(() => {
        setLoad(true);
        // load printers
        // load invents
        setInvents(invs)
        // setItems(itms)
        invs.sort((a, b) => a.store < b.store ? -1 : 0)
        document.title = "IT invent"
        setLoad(false);
    }, [])

    useEffect(() => {
        // move to data.ts ??
        switch (report.name) {
            case "All":
                setShown(items);
                break;
            case "Free":
                setShown([]);
                break;
            case "Найдено":
                setShown([]);
                break;
            case "Не найдено":
                setShown([]);
                break;
            case "Утиль":
                setShown([]);
                break;
            case "По местам":
                setShown([]);
                break;
            case "Кассы":
                setShown([]);
                break;
}
    }, [report])
    
    return (
        <Box p={"8%"} pt={"5vh"} sx={{display: "flex", flexDirection:"row",flexWrap: "wrap"}}>
            {load &&<CircularSpinner />}
            <Grid container spacing={1}  width={"30%"} minWidth={"600px"}>
                <Grid item xs={9}>
                    <Select
                        fullWidth
                        size="small"
                        id="inventory-select"
                        value={inventory?inventory.key:null}
                        onChange={(event) =>handleSelectInvent(event)}>
                        {invents && invents.map((inv: Invent) => {
                            return (<MenuItem value={inv.key}>{ inv.store }</MenuItem>)
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Button fullWidth variant="contained" sx={{ height: '39px' }} onClick={requestInventItems}>Запрос к БД</Button>
                </Grid>
                <Grid item xs={3}>
                    <Button fullWidth variant="contained" sx={{height: '39px'}} onClick={() => setShowFilters(!showFilter)}>Фильтры</Button>
                </Grid>
                <Grid item xs={3}>
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <Fragment>
                            <Button fullWidth variant="contained" sx={{height: '39px'}} {...bindTrigger(popupState)}>Отчеты<ExpandMoreIcon /></Button>
                                <Menu {...bindMenu(popupState)}>
                                    {reports && reports.sort((a, b) => a.name < b.name ? -1 : 0).map((report) => [
                                        (<MenuItem onClick={() => { setReport(report); popupState.close}} value={report.name}>{report.name}</MenuItem>)
                                ])}
                    </Menu>
                    </Fragment>
                )}
                </PopupState>
                </Grid>
                <Grid item xs={3}>
                    <Button fullWidth variant="contained" sx={{ height: '39px' }} onClick={requestInventItems}>Печать</Button>
                </Grid>
                <Grid item xs={3}>
                    <Button fullWidth variant="contained" sx={{height: '39px'}} onClick={requestInventItems} color="success"><TableViewIcon />В Excel</Button>
                </Grid>
            </Grid>
            {showFilter &&
                <Box boxShadow={3} sx={{ position: "absolute", width: "600px", marginLeft: "50%", left: "-300px", marginTop: '30vh', background: "white" }}>
                    <IconButton aria-label="close" sx={{ position: "absolute", left: "560px" }} onClick={() => setShowFilters(false)}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                    <Grid container p={"10px 20px"}>
                    {[...filters.keys()].map((field) => {
                        return (
                            <Grid item xs={6}>
                                <FormControlLabel control={<Checkbox onChange={(event) => { handleChangeFilter(event) }} value={field} checked={fields.get(field)} />} label={field} />
                            </Grid>
                        )
                    })}
                    </Grid>
                </Box>}
            <Box justifyContent={"center"} flexGrow={1}>
                {report && <Typography display="block" width={"100%"} variant="h5" color="initial" textAlign={"center"}>{report.label}</Typography>}
                {shownItems && <Typography display='block' width={"100%"} variant="overline" color="initial" textAlign={'center'}>результатов оборажено {shownItems.length}</Typography>}
            </Box>
            <ItemsTable parent_items={ shownItems } fields={ fields } report={ report }/>
        </Box>
    )
};
