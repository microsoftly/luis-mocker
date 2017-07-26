import { CustomEntity, PrebuiltEntity } from 'luis-entity-builder';
import { ILuisResponse } from './ILuisResponse';
export declare class LuisResponseBuilder {
    private query;
    private intents;
    private entities;
    constructor(query: string);
    setQuery(query: string): LuisResponseBuilder;
    addIntent(intent: string, score: number): LuisResponseBuilder;
    addPrebuiltEntity(entity: PrebuiltEntity): LuisResponseBuilder;
    addCustomEntity(entity: CustomEntity): LuisResponseBuilder;
    build(): ILuisResponse;
    private sortIntentsByDescendingScore();
    private addOrReplaceIntent(intent);
}
