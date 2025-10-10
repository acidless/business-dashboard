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
    discount_percent: number;
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

export type Sale = {
    g_number: string;
    date: string;
    last_change_date: string;
    supplier_article: string;
    tech_size: string;
    barcode: number;
    total_price: string;
    discount_percent: number;
    is_supply: boolean;
    is_realization: boolean
    promo_code_discount: null | string;
    warehouse_name: string;
    country_name: string;
    oblast_okrug_name: string;
    region_name: string;
    income_id: number;
    odid: string;
    spp: string;
    for_pay: string;
    finished_price: string;
    price_with_disc: string;
    nm_id: number;
    subject: string;
    category: string;
    brand: string;
    is_storno: null;
}

export type Stock = {
    date: string;
    last_change_date: string;
    supplier_article: string;
    tech_size: string;
    barcode: number;
    quantity: number;
    is_supply: boolean;
    is_realization: boolean;
    quantity_full: number;
    warehouse_name: string;
    in_way_to_client: number;
    in_way_from_client: number;
    nm_id: number;
    subject: string;
    category: string;
    brand: string;
    sc_code: number;
    price: string;
    discount: string;
}