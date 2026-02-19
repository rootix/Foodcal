export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            meal: {
                Row: {
                    date: string;
                    id: number;
                    notes: string | null;
                    type: Database['public']['Enums']['meal_type'];
                };
                Insert: {
                    date: string;
                    id?: number;
                    notes?: string | null;
                    type: Database['public']['Enums']['meal_type'];
                };
                Update: {
                    date?: string;
                    id?: number;
                    notes?: string | null;
                    type?: Database['public']['Enums']['meal_type'];
                };
                Relationships: [];
            };
            meal_dish: {
                Row: {
                    meal_id: number;
                    dish_id: number;
                };
                Insert: {
                    meal_id: number;
                    dish_id: number;
                };
                Update: {
                    meal_id?: number;
                    dish_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'meal_dish_meal_id_fkey';
                        columns: ['meal_id'];
                        referencedRelation: 'meal';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'meal_dish_dish_id_fkey';
                        columns: ['dish_id'];
                        referencedRelation: 'dish';
                        referencedColumns: ['id'];
                    },
                ];
            };
            dish: {
                Row: {
                    deleted: boolean;
                    id: number;
                    name: string;
                    url: string | null;
                };
                Insert: {
                    deleted?: boolean;
                    id?: number;
                    name: string;
                    url?: string | null;
                };
                Update: {
                    deleted?: boolean;
                    id?: number;
                    name?: string;
                    url?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            dish_with_last_preparation: {
                Row: {
                    deleted: boolean | null;
                    id: number | null;
                    last_preparation: string | null;
                    name: string | null;
                    url: string | null;
                };
                Insert: {
                    deleted?: boolean | null;
                    id?: number | null;
                    last_preparation?: never;
                    name?: string | null;
                    url?: string | null;
                };
                Update: {
                    deleted?: boolean | null;
                    id?: number | null;
                    last_preparation?: never;
                    name?: string | null;
                    url?: string | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            meal_type: 'Dinner' | 'Lunch';
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
