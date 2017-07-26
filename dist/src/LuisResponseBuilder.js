"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class LuisResponseBuilder {
    constructor(query) {
        this.query = query;
        this.intents = [];
        this.entities = [];
    }
    setQuery(query) {
        this.query = query;
        return this;
    }
    addIntent(intent, score) {
        this.addOrReplaceIntent({ intent, score });
        return this;
    }
    addPrebuiltEntity(entity) {
        this.entities.push(entity);
        return this;
    }
    addCustomEntity(entity) {
        this.entities.push(entity);
        return this;
    }
    build() {
        this.sortIntentsByDescendingScore();
        const topScoringIntent = this.intents[0];
        return {
            topScoringIntent,
            query: this.query,
            intents: this.intents,
            entities: this.entities
        };
    }
    sortIntentsByDescendingScore() {
        this.intents.sort((a, b) => b.score - a.score);
    }
    addOrReplaceIntent(intent) {
        const existingIntent = lodash_1.find(this.intents, ((i) => i.intent === intent.intent));
        if (existingIntent) {
            existingIntent.score = intent.score;
        }
        else {
            this.intents.push(intent);
        }
        return this;
    }
}
exports.LuisResponseBuilder = LuisResponseBuilder;
//# sourceMappingURL=LuisResponseBuilder.js.map