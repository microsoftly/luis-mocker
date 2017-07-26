import { expect } from 'chai';
import { find } from 'lodash';
import { DateTimeV2, Entity, prebuiltTypes } from 'luis-response-builder';
import { ILuisResponse } from '../src/ILuisResponse';
import { LuisResponseBuilder } from '../src/LuisResponseBuilder';

const relativeDate = new Date('2015');
const QUERY = 'I wanted to cancel my reservation at benu and taco bell on 9/22.';
const CANCEL_RESERVATION_INTENT = 'cancelReservation';
const LOGIN_ISSUES_INTENT = 'loginIssues';
const NONE_INTENT = 'none';

describe('LuisResponseBuilder', () => {
    let luisResponse: ILuisResponse;

    before(() => {
        const luisResponseBuilder = new LuisResponseBuilder(QUERY);
        luisResponse =
            luisResponseBuilder.addCustomEntity({score: .9, type: 'restaurantName', entity: 'benu', startIndex: 4, endIndex: 10})
                .addCustomEntity({score: .95, type: 'restaurantName', entity: 'taco bell', startIndex: 15, endIndex: 20})
                .addPrebuiltEntity(DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate('9/22', 0, 4, new Date('9/22'), relativeDate))
                .addIntent(CANCEL_RESERVATION_INTENT, .98)
                .addIntent(LOGIN_ISSUES_INTENT, .4)
                .addIntent(NONE_INTENT, .02)
                .build();
    });

    it('builds query correctly', () => {
        expect(luisResponse.query).to.be.equal(QUERY);
    });

    it('adds intents in score descending order', () => {
        const intents = luisResponse.intents;

        expect(intents.length).to.be.equal(3);

        const cancelReservationIntent = intents[0];
        const loginIssuesIntent = intents[1];
        const noneIntent = intents[2];

        expect(cancelReservationIntent.intent).to.be.equal(CANCEL_RESERVATION_INTENT);
        expect(loginIssuesIntent.intent).to.be.equal(LOGIN_ISSUES_INTENT);
        expect(noneIntent.intent).to.be.equal(NONE_INTENT);

        expect(cancelReservationIntent.score).to.be.equal(.98);
        expect(loginIssuesIntent.score).to.be.equal(.4);
        expect(noneIntent.score).to.be.equal(.02);
    });

    it('adds entites', () => {
        const entities = luisResponse.entities;
        expect(entities.length).to.be.equal(3);

        // tslint:disable
        expect(find(entities, (entity: Entity) => entity.type === `${prebuiltTypes.datetimeV2Type}.${prebuiltTypes.datetimeV2.datetimeV2DateType}`)).not.to.be.undefined;
        expect(find(entities, (entity: Entity) => entity.type === 'restaurantName' && entity.entity === 'taco bell')).not.to.be.undefined;
        expect(find(entities, (entity: Entity) => entity.type === 'restaurantName' && entity.entity === 'benu')).not.to.be.undefined;
        // tslint:enable
    });
});
