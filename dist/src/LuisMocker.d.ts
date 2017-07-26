import { ILuisResponse } from './ILuisResponse';
export declare class LuisMocker {
    private baseUrl;
    constructor(baseUrl: string);
    private static getUtteranceUrl(baseUrl, utterance);
    mock(utterance: string, responseBody: ILuisResponse): LuisMocker;
}
