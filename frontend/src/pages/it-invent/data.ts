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
  invented?: string;
  [key: string]: any;
}

export interface Report {
  name: string;
  label: string;
  filter?: Map<string, Array<string>>;
}



export const reports: Array<Report> = [
  { name: 'All', label: 'Всё оборудование ТЦ' }, // All mast be with index 0
  { name: 'Найдено', label: 'Отчет по найденному оборудованию', filter: new Map([['Invented', ['yes']]]) },
  { name: 'Не найдено', label: 'Отчет по не найденному оборудованию', filter: new Map([['Invented', ['no']]]) },
  { name: 'Улить', label: 'Отчет по оборудованию на списание', filter: new Map([['State', ['To Discard']]]) },
  { name: 'По местам', label: 'Отчет по рабочит местам', filter: new Map([['Location', ['!EDP']]]) },
  {
    name: 'Кассы',
    label: 'Отчет по кассам',
    filter: new Map([
      [
        'Type',
        [
          'BARCODE HANDHELD SCANNER',
          'BARCODE RADIO BASE',
          'BARCODE RADIO SCANNER',
          'BARCODE TABLE SCANNER',
          'CR CASH DRAW',
          'CR CUSTOMER MONITOR',
          'CR FISCAL REGISTER',
          'CR MONITOR',
          'CR SYSTEM BASE',
        ],
      ],
      ['Location', ['!EDP Storage', '!EDP Service', '!EDP Storage(Virtual)']],
    ]),
  },
  {
    name: 'Free',
    label: 'Отчет по статусу Free',
    filter: new Map([
      ['Location', ['!WANTED!!!']],
      ['State', ['Free', 'Stock OK']],
      ['Type', ['CR PRINTER', 'JETDIRECT', 'MODEM EXTERNAL', 'VPN MODULE', 'PHONE GARNITURE', 'USB Wi-Fi Adapter', 'Tape'].map((item) => '!' + item)],
      [
        'Model',
        [
          'DS4308-HD7U2100AZW',
          'SYMBOL LS2208',
          'PSC HS1250',
          'PSC MAGELLAN 8200',
          'DVD-RW',
          'CHS9000 (without ethernet ports)',
          'CRD9000-411CR (w pwr supply & DC cbl)',
          'SIEMENS OptiPoint 500 ADVANCE',
          'SIEMENS OPTIPOINT 500',
          '3COM SWITCH',
          'HP EliteDesk 800 G1 SFF',
          'HP t510 Smart Zero ES WF Flex TC',
          'Zebra ZXP3',
          'HP t5335z',
        ].map((item) => '!' + item),
      ],
    ]),
  },
];

export const filters = new Map([
  ['INV No', true],
  ['Name', true],
  ['Model', true],
  ['Type', false],
  ['Location', true],
  ['Serial No', false],
  ['State', true],
  ['Status', false],
  ['User', false],
  ['Print', false],
]);

export const filterItems = (items: Array<Item>, filter?: Map<string, Array<string>> | undefined): Array<Item> => {
  if (items && filter && filter.size) {
    return items.filter((item: Item) => {
      return [...filter]
        .map((one) => {
          let yes = Array<string>();
          let not = Array<string>();
          one[1].map((o) => {
            if (o[0] === '!') {
              not.push(o);
            } else {
              yes.push(o);
            }
          });

          return (
            (yes.length === 0 ||
              yes.some((attr: string) => {
                if (attr.length == 0) {
                  return true;
                } else if (attr === '?') {
                  return item[one[0]] ? true : false;
                } else {
                  return (item[one[0]] ? item[one[0]] : '').toLowerCase().includes(attr.toLowerCase());
                }
              })) &&
            !not.some((attr) => {
              if (attr.length <= 1) {
                return false;
              } else {
                return (item[one[0]] ? item[one[0]] : '').toLowerCase().includes(attr.slice(1).toLowerCase());
              }
            })
          );
        })
        .every((condi) => condi);
    });
  }
  return items;
};
