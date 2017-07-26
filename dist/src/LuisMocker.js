"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nock = require("nock");
const url = require("url");
class LuisMocker {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    static getUtteranceUrl(baseUrl, utterance) {
        const uri = url.parse(baseUrl, true);
        uri.query.q = utterance || '';
        if (uri.search) {
            delete uri.search;
        }
        return url.format(uri);
    }
    // keep the {} to allow custom extension
    mock(utterance, responseBody) {
        nock(LuisMocker.getUtteranceUrl(this.baseUrl, utterance))
            .get('')
            .query((queryParams) => queryParams.q === utterance)
            .times(10000000000000)
            .reply(200, responseBody);
        return this;
    }
}
exports.LuisMocker = LuisMocker;
//# sourceMappingURL=LuisMocker.js.map