import * as Promise from 'bluebird';
import { expect } from 'chai';
import { DateTimeV2, ILuisResponse, LuisResponseBuilder } from 'luis-response-builder';
import * as rp from 'request-promise';
import { LuisMocker } from './../src/LuisMocker';

const LUIS_URL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/appId?subscription-key=subKey&timezoneOffset=0&verbose=true&q=';
const CANCEL_INTENT = 'cancel';
const LOGIN_INTENT = 'login';
const NONE_INTENT = 'none';
const TACO_BELL = 'taco bell';
const BENU = 'benu';
const RESTAURANT_NAME = 'restaurantName';
const RELATIVE_YEAR = new Date('2015');

const cancelTacoBellReservationUtterance = `I want to cancel my reservation at ${TACO_BELL} on July 15th`;
const cancelBenuReservationUtternace = `My reservation at ${BENU} needs to be canceled`;
const loginIssuesUtterance = 'I\'m having trouble loggin in';

// don't want to make the getUtteranceUrl public, but still want to use it here
// tslint:disable
const cancelTacoBellUri = LuisMocker['getUtteranceUrl'](LUIS_URL, cancelTacoBellReservationUtterance);
const cancelBenuUri = LuisMocker['getUtteranceUrl'](LUIS_URL, cancelBenuReservationUtternace);
const loginIssuesUri = LuisMocker['getUtteranceUrl'](LUIS_URL, loginIssuesUtterance);
// tslint:enable

const july15AmbiguousDateEntity =
    DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate('July 15th', 0, 4, new Date('7/19'), RELATIVE_YEAR);

const cancelTacoBellResponse = new LuisResponseBuilder(cancelTacoBellReservationUtterance)
    .addCustomEntity({ startIndex: 0, endIndex: 4, type: RESTAURANT_NAME, entity: TACO_BELL, score: .98 })
    .addPrebuiltEntity(july15AmbiguousDateEntity)
    .addIntent(CANCEL_INTENT, .92)
    .addIntent(LOGIN_INTENT, .3)
    .addIntent(NONE_INTENT, .02)
    .build();

const cancelBenuResponse = new LuisResponseBuilder(cancelBenuReservationUtternace)
    .addCustomEntity({ startIndex: 0, endIndex: 4, type: RESTAURANT_NAME, entity: BENU, score: .90 })
    .addIntent(CANCEL_INTENT, .98)
    .addIntent(LOGIN_INTENT, .28)
    .addIntent(NONE_INTENT, .01)
    .build();

const loginIssuesResponse = new LuisResponseBuilder(loginIssuesUtterance)
    .addIntent(LOGIN_INTENT, .78)
    .addIntent(CANCEL_INTENT, .2)
    .addIntent(NONE_INTENT, .01)
    .build();

describe('LuisMocker', () => {
    before(() => {
        new LuisMocker(LUIS_URL)
            .mock(cancelTacoBellReservationUtterance, cancelTacoBellResponse)
            .mock(cancelBenuReservationUtternace, cancelBenuResponse)
            .mock(loginIssuesUtterance, loginIssuesResponse);
    });

    it('returns the appropriate mock for the utternace', () => {
        return Promise.all([
            rp.get(cancelTacoBellUri, {json: true}),
            rp.get(cancelBenuUri, {json: true}),
            rp.get(loginIssuesUri, {json: true})
        ]).spread(
            (cancelTacoBellTestResponse: ILuisResponse, cancelBenuTestResponse: ILuisResponse, loginIssuesTestResponse: ILuisResponse) => {
                // console.log(JSON.stringify(cancelTacoBellTestResponse, null, 2));
                expect(cancelTacoBellTestResponse).to.deep.equal(cancelTacoBellResponse);
                expect(cancelBenuTestResponse).to.deep.equal(cancelBenuResponse);
                expect(loginIssuesTestResponse).to.deep.equal(loginIssuesResponse);
        });
    });

    it('returns the same response after multiple calls', () => {
        const runNTimes = (i: number) => {
            return i ? rp.get(loginIssuesUri, {json: true})
                .then((loginIssuesTestResponse: ILuisResponse) => expect(loginIssuesTestResponse).to.deep.equal(loginIssuesResponse))
                :
                Promise.resolve();
        };

        return runNTimes(3);
    });
});
