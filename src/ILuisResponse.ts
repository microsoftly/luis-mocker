import { Entity, Intent } from 'luis-response-builder';

export interface ILuisResponse {
  query: string;
  topScoringIntent: Intent;
  intents: Intent[];
  entities: Entity[];
}
