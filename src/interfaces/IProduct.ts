export enum ICategories {
    ELECTRONICS = 'ELECTRONICS',
    FURNITURE = 'FURNITURE',
    HOME_APPLIANCES = 'HOME_APPLIANCES',
    SPORTING_GOODS = 'SPORTING_GOODS',
    OUTDOOR = 'OUTDOOR',
    TOYS = 'TOYS',
}

export enum IRentOption {
    HOUR = 'HOUR',
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
}

export interface IProduct {
    id: string,
    title: string;
    categories: ICategories[];
    description: string;
    price: number;
    rentPrice: number;
    rentOption: IRentOption;
    createdAt: string;
    owner: { id: string };
}