export interface Item {
    Key: string;
    Name: string;
    User: string;
    "INV No": string;
    "Serial No": string;
    Model: string;
    Store: string;
    Location: string;
    State: string;
    // ITREQ properties
    "комментарий"?: string|undefined;
    "For user"?: string|undefined;
    "inv."?: string|undefined;
    [key: string]: string|undefined;

}

export interface Store {
    Key: string;
    Name: string;
}

export interface Location {
    Key: string;
    Name: string;
    Store: Array<Store>;
}

export interface User {
    'ФИО': string;
    Email: string;
    Store: string
}