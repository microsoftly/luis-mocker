"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const luis_entity_builder_1 = require("luis-entity-builder");
const LuisResponseBuilder_1 = require("../src/LuisResponseBuilder");
const relativeDate = new Date('2015');
const QUERY = 'I wanted to cancel my reservation at benu and taco bell on 9/22.';
const CANCEL_RESERVATION_INTENT = 'cancelReservation';
const LOGIN_ISSUES_INTENT = 'loginIssues';
const NONE_INTENT = 'none';
describe('LuisResponseBuilder', () => {
    let luisResponse;
    before(() => {
        const luisResponseBuilder = new LuisResponseBuilder_1.LuisResponseBuilder(QUERY);
        luisResponse =
            luisResponseBuilder.addCustomEntity({ score: .9, type: 'restaurantName', entity: 'benu', startIndex: 4, endIndex: 10 })
                .addCustomEntity({ score: .95, type: 'restaurantName', entity: 'taco bell', startIndex: 15, endIndex: 20 })
                .addPrebuiltEntity(luis_entity_builder_1.DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate('9/22', 0, 4, new Date('9/22'), relativeDate))
                .addIntent(CANCEL_RESERVATION_INTENT, .98)
                .addIntent(LOGIN_ISSUES_INTENT, .4)
                .addIntent(NONE_INTENT, .02)
                .build();
    });
    it('builds query correctly', () => {
        chai_1.expect(luisResponse.query).to.be.equal(QUERY);
    });
    it('adds intents in score descending order', () => {
        const intents = luisResponse.intents;
        chai_1.expect(intents.length).to.be.equal(3);
        const cancelReservationIntent = intents[0];
        const loginIssuesIntent = intents[1];
        const noneIntent = intents[2];
        chai_1.expect(cancelReservationIntent.intent).to.be.equal(CANCEL_RESERVATION_INTENT);
        chai_1.expect(loginIssuesIntent.intent).to.be.equal(LOGIN_ISSUES_INTENT);
        chai_1.expect(noneIntent.intent).to.be.equal(NONE_INTENT);
        chai_1.expect(cancelReservationIntent.score).to.be.equal(.98);
        chai_1.expect(loginIssuesIntent.score).to.be.equal(.4);
        chai_1.expect(noneIntent.score).to.be.equal(.02);
    });
    it('adds entites', () => {
        const entities = luisResponse.entities;
        chai_1.expect(entities.length).to.be.equal(3);
        // tslint:disable
        chai_1.expect(lodash_1.find(entities, (entity) => entity.type === `${luis_entity_builder_1.prebuiltTypes.datetimeV2Type}.${luis_entity_builder_1.prebuiltTypes.datetimeV2.datetimeV2DateType}`)).not.to.be.undefined;
        chai_1.expect(lodash_1.find(entities, (entity) => entity.type === 'restaurantName' && entity.entity === 'taco bell')).not.to.be.undefined;
        chai_1.expect(lodash_1.find(entities, (entity) => entity.type === 'restaurantName' && entity.entity === 'benu')).not.to.be.undefined;
        // tslint:enable
    });
});
//# sourceMappingURL=LuisResponseBuilder.spec.js.map