import { useEffect, useContext, useState } from "react"
import { UserContext, user } from "../../App";
import { MenuButton, mBtn } from './button'
import { checkPermission, permissions } from "../../permissions";

import Box from '@mui/material/Box';
import { useSearchParams } from "react-router-dom";

// define buttons and there viasability permission here
const mainButtons: Array<mBtn> = [
    { text: "Учет мобильного оборудования", roles: [], type: "href", to: '/mobile' },
    { text: "Учет IT оборудования", roles: permissions.ItInvent, type: "link", to:'/?p=it'},
    { text: "In development", roles: ["MCC_RU_INSIGHT_QA_ROLE"], type: 'link', to:'/?p=dev'}
]

const itButtons: Array<mBtn> = [
    { text: "Управление IT инвентаризациями", roles: ['MCC_RU_INSIGHT_IT_INVENTADMIN_ROLE'], type: "href", to: '/it_inventory_management' },
    { text: "редактирование одной еденицы", roles: permissions.ItInvent, type: "href", to: '/single-edit/main' },
    { text: "Групповое редактирование", roles: permissions.ItInvent, type: "href", to: '/group-edit/main' },
]
const devButtons: Array<mBtn> = [
    
    { text: "Проведение IT инвентаризаций", roles: permissions.ItInvent, type: "link", to: '/it-invent' },
    { text: "Логи", roles: ["MCC_RU_INSIGHT_QA_ROLE"], type: "href", to: '/dev/logs'}, 

]


export default function Index() {
    const user = useContext<user>(UserContext);
    const [subPage, setSubPage] = useState<string | null>(null);
    const [params, _]= useSearchParams();

    // buttons to url placement
    const getPage = (addr: string | null) => {
        if (addr == "dev" && checkPermission(user, ["MCC_RU_INSIGHT_QA_ROLE"])) {
            return (getButtons('dev'))}
     else if (addr == "it" && checkPermission(user, permissions.ItInvent)) {
        return (getButtons('it'))
    } else if (addr == "management" && checkPermission(user, permissions.ItInvent)) {
        return (<h2>Management</h2>)
    } else {
        return (getButtons(''))
    }
};

    const getButtons = (addr: string) => {
        let btns = []
        switch (addr) {
            case "dev":
                btns = devButtons;
                break;
            case 'it':
                btns = itButtons;
                break;
            default:
                btns = mainButtons;
        }
        return btns.map((btn:mBtn) => {
            if (!btn.roles.length || checkPermission(user, btn.roles)) {
                return <MenuButton button={btn} />
            }
        })
    }

    useEffect(() => {
        document.title = "Asset-tools"
        setSubPage(params.get('p'))
    }, [params])

    return (
        <>
            <Box sx={{
                height: "50vh",
                width: "80%",
                borderRadius: 2,
                boxShadow: 3,
                margin: "8% 10%",
                padding: "1rem"
            }}>
                {user ? getPage(subPage) : ''} 
            </Box>
        </>
           
    )
};
