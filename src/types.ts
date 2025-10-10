export type Income = {
    barcode: number;
    date: string;
    date_close: string;
    income_id: number;
    last_change_date: string;
    nm_id: number;
    number: string;
    quantity: number;
    supplier_article: string;
    tech_size: string;
    total_price: string;
    warehouse_name: string;
}

export type Order = {
    g_number: string;
    date: string;
    last_change_date: string;
    supplier_article: string;
    barcode: number;
    tech_size: string;
    total_price: string;
    discord_percent: number;
    warehouse_name: string;
    oblast: string;
    income_id: number;
    odid: string;
    nm_id: number;
    subject: string;
    category: string;
    brand: string;
    is_cancel: boolean;
    cancel_dt: null;
}
