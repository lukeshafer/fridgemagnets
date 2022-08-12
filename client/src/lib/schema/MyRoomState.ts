// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.36
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'
import { PromptCard } from './PromptCard'

export class MyRoomState extends Schema {
    @type("string") public roomId!: string;
    @type("string") public gamePhase!: string;
    @type("number") public turn!: number;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type(PromptCard) public currentPrompt: PromptCard = new PromptCard();
    @type("string") public showcaseID!: string;
}
