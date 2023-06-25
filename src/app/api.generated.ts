import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    Date: { input: string; output: string };
    Long: { input: number; output: number };
    Time: { input: unknown; output: unknown };
};

export type Meal = {
    __typename?: 'Meal';
    _id: Scalars['ID']['output'];
    _ts: Scalars['Long']['output'];
    date: Scalars['Date']['output'];
    notes?: Maybe<Scalars['String']['output']>;
    recipe: Recipe;
    type: MealType;
};

export type MealInput = {
    date: Scalars['Date']['input'];
    notes?: InputMaybe<Scalars['String']['input']>;
    recipe?: InputMaybe<MealRecipeRelation>;
    type: MealType;
};

export type MealPage = {
    __typename?: 'MealPage';
    after?: Maybe<Scalars['String']['output']>;
    before?: Maybe<Scalars['String']['output']>;
    data: Array<Maybe<Meal>>;
};

export type MealRecipeRelation = {
    connect?: InputMaybe<Scalars['ID']['input']>;
    create?: InputMaybe<RecipeInput>;
};

export enum MealType {
    Dinner = 'Dinner',
    Lunch = 'Lunch',
}

export type Mutation = {
    __typename?: 'Mutation';
    createMeal: Meal;
    createRecipe: Recipe;
    deleteMeal?: Maybe<Meal>;
    deleteRecipe?: Maybe<Recipe>;
    partialUpdateMeal?: Maybe<Meal>;
    partialUpdateRecipe?: Maybe<Recipe>;
    updateMeal?: Maybe<Meal>;
    updateRecipe?: Maybe<Recipe>;
};

export type MutationCreateMealArgs = {
    data: MealInput;
};

export type MutationCreateRecipeArgs = {
    data: RecipeInput;
};

export type MutationDeleteMealArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteRecipeArgs = {
    id: Scalars['ID']['input'];
};

export type MutationPartialUpdateMealArgs = {
    data: PartialUpdateMealInput;
    id: Scalars['ID']['input'];
};

export type MutationPartialUpdateRecipeArgs = {
    data: PartialUpdateRecipeInput;
    id: Scalars['ID']['input'];
};

export type MutationUpdateMealArgs = {
    data: MealInput;
    id: Scalars['ID']['input'];
};

export type MutationUpdateRecipeArgs = {
    data: RecipeInput;
    id: Scalars['ID']['input'];
};

export type PartialUpdateMealInput = {
    date?: InputMaybe<Scalars['Date']['input']>;
    notes?: InputMaybe<Scalars['String']['input']>;
    recipe?: InputMaybe<MealRecipeRelation>;
    type?: InputMaybe<MealType>;
};

export type PartialUpdateRecipeInput = {
    deleted?: InputMaybe<Scalars['Boolean']['input']>;
    meals?: InputMaybe<RecipeMealsRelation>;
    name?: InputMaybe<Scalars['String']['input']>;
    note?: InputMaybe<Scalars['String']['input']>;
    tags?: InputMaybe<Array<Scalars['String']['input']>>;
    url?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
    __typename?: 'Query';
    allMeals: MealPage;
    allMealsInDateRange: QueryAllMealsInDateRangePage;
    allRecipes: RecipePage;
    allRecipesByDeletedFlag: RecipePage;
    findMealByID?: Maybe<Meal>;
    findRecipeByID?: Maybe<Recipe>;
};

export type QueryAllMealsArgs = {
    _cursor?: InputMaybe<Scalars['String']['input']>;
    _size?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryAllMealsInDateRangeArgs = {
    _cursor?: InputMaybe<Scalars['String']['input']>;
    _size?: InputMaybe<Scalars['Int']['input']>;
    from: Scalars['Date']['input'];
    to: Scalars['Date']['input'];
};

export type QueryAllRecipesArgs = {
    _cursor?: InputMaybe<Scalars['String']['input']>;
    _size?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryAllRecipesByDeletedFlagArgs = {
    _cursor?: InputMaybe<Scalars['String']['input']>;
    _size?: InputMaybe<Scalars['Int']['input']>;
    deleted: Scalars['Boolean']['input'];
};

export type QueryFindMealByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryFindRecipeByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryAllMealsInDateRangePage = {
    __typename?: 'QueryAllMealsInDateRangePage';
    after?: Maybe<Scalars['String']['output']>;
    before?: Maybe<Scalars['String']['output']>;
    data: Array<Maybe<Meal>>;
};

export type Recipe = {
    __typename?: 'Recipe';
    _id: Scalars['ID']['output'];
    _ts: Scalars['Long']['output'];
    deleted: Scalars['Boolean']['output'];
    meals: MealPage;
    name: Scalars['String']['output'];
    note?: Maybe<Scalars['String']['output']>;
    tags?: Maybe<Array<Scalars['String']['output']>>;
    url?: Maybe<Scalars['String']['output']>;
};

export type RecipeMealsArgs = {
    _cursor?: InputMaybe<Scalars['String']['input']>;
    _size?: InputMaybe<Scalars['Int']['input']>;
};

export type RecipeInput = {
    deleted: Scalars['Boolean']['input'];
    meals?: InputMaybe<RecipeMealsRelation>;
    name: Scalars['String']['input'];
    note?: InputMaybe<Scalars['String']['input']>;
    tags?: InputMaybe<Array<Scalars['String']['input']>>;
    url?: InputMaybe<Scalars['String']['input']>;
};

export type RecipeMealsRelation = {
    connect?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    create?: InputMaybe<Array<InputMaybe<MealInput>>>;
    disconnect?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type RecipePage = {
    __typename?: 'RecipePage';
    after?: Maybe<Scalars['String']['output']>;
    before?: Maybe<Scalars['String']['output']>;
    data: Array<Maybe<Recipe>>;
};

export type GetMealsOfWeekQueryVariables = Exact<{
    from: Scalars['Date']['input'];
    to: Scalars['Date']['input'];
    size: Scalars['Int']['input'];
}>;

export type GetMealsOfWeekQuery = {
    __typename?: 'Query';
    allMealsInDateRange: {
        __typename?: 'QueryAllMealsInDateRangePage';
        data: Array<{
            __typename?: 'Meal';
            _id: string;
            _ts: number;
            date: string;
            type: MealType;
            notes?: string | null;
            recipe: { __typename?: 'Recipe'; _id: string; name: string; url?: string | null };
        } | null>;
    };
};

export type GetAllRecipesQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllRecipesQuery = {
    __typename?: 'Query';
    allRecipesByDeletedFlag: {
        __typename?: 'RecipePage';
        data: Array<{
            __typename?: 'Recipe';
            _id: string;
            name: string;
            url?: string | null;
            note?: string | null;
            tags?: Array<string> | null;
            deleted: boolean;
            meals: { __typename?: 'MealPage'; data: Array<{ __typename?: 'Meal'; date: string } | null> };
        } | null>;
    };
};

export type CreateRecipeMutationVariables = Exact<{
    name: Scalars['String']['input'];
    url?: InputMaybe<Scalars['String']['input']>;
    note?: InputMaybe<Scalars['String']['input']>;
    deleted: Scalars['Boolean']['input'];
    tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;

export type CreateRecipeMutation = { __typename?: 'Mutation'; createRecipe: { __typename?: 'Recipe'; _id: string } };

export type UpdateRecipeMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    name: Scalars['String']['input'];
    url?: InputMaybe<Scalars['String']['input']>;
    note?: InputMaybe<Scalars['String']['input']>;
    deleted: Scalars['Boolean']['input'];
    tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;

export type UpdateRecipeMutation = {
    __typename?: 'Mutation';
    updateRecipe?: { __typename?: 'Recipe'; _ts: number } | null;
};

export type CreateMealMutationVariables = Exact<{
    date: Scalars['Date']['input'];
    type: MealType;
    recipe: MealRecipeRelation;
    notes?: InputMaybe<Scalars['String']['input']>;
}>;

export type CreateMealMutation = { __typename?: 'Mutation'; createMeal: { __typename?: 'Meal'; _id: string } };

export type UpdateMealMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    date: Scalars['Date']['input'];
    type: MealType;
    recipe: MealRecipeRelation;
    notes?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateMealMutation = { __typename?: 'Mutation'; updateMeal?: { __typename?: 'Meal'; _ts: number } | null };

export type DeleteMealMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteMealMutation = { __typename?: 'Mutation'; deleteMeal?: { __typename?: 'Meal'; _id: string } | null };

export const GetMealsOfWeekDocument = gql`
    query GetMealsOfWeek($from: Date!, $to: Date!, $size: Int!) {
        allMealsInDateRange(from: $from, to: $to, _size: $size) {
            data {
                _id
                _ts
                date
                recipe {
                    _id
                    name
                    url
                }
                type
                notes
            }
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class GetMealsOfWeekGQL extends Apollo.Query<GetMealsOfWeekQuery, GetMealsOfWeekQueryVariables> {
    override document = GetMealsOfWeekDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetAllRecipesDocument = gql`
    query GetAllRecipes {
        allRecipesByDeletedFlag(_size: 1000, deleted: false) {
            data {
                _id
                name
                url
                note
                tags
                deleted
                meals(_size: 1000) {
                    data {
                        date
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class GetAllRecipesGQL extends Apollo.Query<GetAllRecipesQuery, GetAllRecipesQueryVariables> {
    override document = GetAllRecipesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CreateRecipeDocument = gql`
    mutation CreateRecipe($name: String!, $url: String, $note: String, $deleted: Boolean!, $tags: [String!]) {
        createRecipe(data: { name: $name, url: $url, note: $note, deleted: $deleted, tags: $tags }) {
            _id
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class CreateRecipeGQL extends Apollo.Mutation<CreateRecipeMutation, CreateRecipeMutationVariables> {
    override document = CreateRecipeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpdateRecipeDocument = gql`
    mutation UpdateRecipe($id: ID!, $name: String!, $url: String, $note: String, $deleted: Boolean!, $tags: [String!]) {
        updateRecipe(id: $id, data: { name: $name, url: $url, note: $note, deleted: $deleted, tags: $tags }) {
            _ts
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class UpdateRecipeGQL extends Apollo.Mutation<UpdateRecipeMutation, UpdateRecipeMutationVariables> {
    override document = UpdateRecipeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CreateMealDocument = gql`
    mutation CreateMeal($date: Date!, $type: MealType!, $recipe: MealRecipeRelation!, $notes: String) {
        createMeal(data: { date: $date, type: $type, recipe: $recipe, notes: $notes }) {
            _id
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class CreateMealGQL extends Apollo.Mutation<CreateMealMutation, CreateMealMutationVariables> {
    override document = CreateMealDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpdateMealDocument = gql`
    mutation UpdateMeal($id: ID!, $date: Date!, $type: MealType!, $recipe: MealRecipeRelation!, $notes: String) {
        updateMeal(id: $id, data: { date: $date, type: $type, recipe: $recipe, notes: $notes }) {
            _ts
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class UpdateMealGQL extends Apollo.Mutation<UpdateMealMutation, UpdateMealMutationVariables> {
    override document = UpdateMealDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DeleteMealDocument = gql`
    mutation DeleteMeal($id: ID!) {
        deleteMeal(id: $id) {
            _id
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class DeleteMealGQL extends Apollo.Mutation<DeleteMealMutation, DeleteMealMutationVariables> {
    override document = DeleteMealDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
