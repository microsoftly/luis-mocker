import { expect } from 'chai';
import { CustomEntity, Entity, Intent, PrebuiltEntity } from 'luis-entity-builder';
import * as nock from 'nock';
import * as rp from 'request-promise';
import * as url from 'url';
import { ILuisResponse } from './ILuisResponse';

export class LuisMocker {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private static getUtteranceUrl(baseUrl: string, utterance: string): string {
        const uri = url.parse(baseUrl, true);
        uri.query.q = utterance || '';

        if (uri.search) {
            delete uri.search;
        }

        return url.format(uri);
    }

    // keep the {} to allow custom extension
    public mock(utterance: string, responseBody: ILuisResponse): LuisMocker {
        nock(LuisMocker.getUtteranceUrl(this.baseUrl, utterance))
            .get('')
            .query((queryParams: {q: string}) => queryParams.q === utterance)
            // arbitrarily large. If someone runs a test with more than these many mock calls, I'll start to be concerned
            .times(10000000000000)
            .reply(200, responseBody);

        return this;
    }
}
