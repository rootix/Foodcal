export interface Recipe {
    _id?: string;
    name: string;
    url?: string;
    lastPreparation?: Date;
    note?: string;
    tags?: string[];
    _ts?: number;
    deleted?: boolean;
}
