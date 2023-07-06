export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            meal: {
                Row: {
                    date: string;
                    id: number;
                    notes: string | null;
                    recipe: number;
                    type: Database['public']['Enums']['meal_type'];
                };
                Insert: {
                    date: string;
                    id?: number;
                    notes?: string | null;
                    recipe: number;
                    type: Database['public']['Enums']['meal_type'];
                };
                Update: {
                    date?: string;
                    id?: number;
                    notes?: string | null;
                    recipe?: number;
                    type?: Database['public']['Enums']['meal_type'];
                };
                Relationships: [
                    {
                        foreignKeyName: 'meal_recipe_fkey';
                        columns: ['recipe'];
                        referencedRelation: 'recipe';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'meal_recipe_fkey';
                        columns: ['recipe'];
                        referencedRelation: 'recipe_with_last_preparation';
                        referencedColumns: ['id'];
                    }
                ];
            };
            recipe: {
                Row: {
                    deleted: boolean;
                    id: number;
                    name: string;
                    note: string | null;
                    tags: string[] | null;
                    url: string | null;
                };
                Insert: {
                    deleted?: boolean;
                    id?: number;
                    name: string;
                    note?: string | null;
                    tags?: string[] | null;
                    url?: string | null;
                };
                Update: {
                    deleted?: boolean;
                    id?: number;
                    name?: string;
                    note?: string | null;
                    tags?: string[] | null;
                    url?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            recipe_with_last_preparation: {
                Row: {
                    deleted: boolean | null;
                    id: number | null;
                    last_preparation: string | null;
                    name: string | null;
                    note: string | null;
                    tags: string[] | null;
                    url: string | null;
                };
                Insert: {
                    deleted?: boolean | null;
                    id?: number | null;
                    last_preparation?: never;
                    name?: string | null;
                    note?: string | null;
                    tags?: string[] | null;
                    url?: string | null;
                };
                Update: {
                    deleted?: boolean | null;
                    id?: number | null;
                    last_preparation?: never;
                    name?: string | null;
                    note?: string | null;
                    tags?: string[] | null;
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
