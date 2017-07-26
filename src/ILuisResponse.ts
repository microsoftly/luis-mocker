import { Entity, Intent } from 'luis-entity-builder';

export interface ILuisResponse {
  query: string;
  topScoringIntent: Intent;
  intents: Intent[];
  entities: Entity[];
}
