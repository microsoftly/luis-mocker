# Luis Mocker [![CircleCI](https://circleci.com/gh/microsoftly/luis-mocker.svg?style=shield)](https://circleci.com/gh/microsoftly/luis-mocker)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmicrosoftly%2Fluis-mocker.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmicrosoftly%2Fluis-mocker?ref=badge_shield)
Easy http mocking of luis.ai. Perfect for testing services that rely on Luis.ai by making them deterministic and avoiding pay per call requests.

This is a work in progress. PRs are welcome! 
# installation
```npm install -save luis-mocker```
# Classes
## LuisMocker
### ```constructor(luisModelUrl)```
### ```mock(utterance, responseBody)```
* mock utterance is the string that is expected.
* responseBody is the response sent back when that utterance is checked. Bodies can be easily built with the [LuisResponseBuilder](github.com/microsoftly/luis-response-builder)
# example use
``` javascript
const Promise = require("bluebird");
const chai = require("chai");
const { DateTimeV2, LuisResponseBuilder } = require("luis-response-builder");
const rp = require("request-promise");
const LuisMocker = require("./../src/LuisMocker");

describe('LuisMocker', () => {
    const july15AmbiguousDateEntity = DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate('July 15th', 0, 4, new Date('7/19'), new Date('2015'));
    const cancelTacoBellResponse = new LuisResponseBuilder('I want to cancel my reservation at Taco Bell on July 15th')
        .addCustomEntity({ startIndex: 0, endIndex: 4, type: 'restaurantName', entity: 'taco bell', score: .98 })
        .addPrebuiltEntity(july15AmbiguousDateEntity)
        .addIntent('cancel', .92)
        .addIntent('login', .3)
        .addIntent('none', .02)
        .build();

    it('can mock requests to luis.ai', () => {
        return rp.get(cancelTacoBellUri, { json: true })
            .then((cancelTacoBellTestResponse) => {
                chai.expect(cancelTacoBellTestResponse).to.deep.equal(cancelTacoBellResponse);
            })
});
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmicrosoftly%2Fluis-mocker.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmicrosoftly%2Fluis-mocker?ref=badge_large)