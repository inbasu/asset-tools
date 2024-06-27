export interface Invent {
    key: string;
    store: string;
    [key: string]: any;
}
export interface Item {
    Key: string;
    Name: string;
    Location: string;
    Type: string;
    Model: string;  
    [key: string]: any;
}

export interface Report {
    name: string;
    label: string;

}

export const reports: Array<Report> = [
    { name: 'All', label: "Всё оборудование ТЦ" }, // All mast be with index 0
    { name: 'Найдено', label: "Отчет по найденному оборудованию" },
    { name: "Не найдено", label: "Отчет по не найденному оборудованию" },
    { name: "Free", label: "Отчет по статусу Free" },
    { name: "Улить", label: "Отчет по оборудованию на списание" },
    { name: 'По местам', label: "Отчет по рабочит местам" },
    { name:"Кассы", label:"Отчет по кассам"}
]

export const filters = new Map([
    ["Name", true],
    ["Model", true],
    ["Type", false],
    ["Location", true],
    ["INV No", false],
    ["Serial No", false],
    ["State", false],
    ["Status", false],
    ["User", false]
]);


