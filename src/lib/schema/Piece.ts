// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.36
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Piece extends Schema {
    @type("string") public word!: string;
    @type("number") public id!: number;
    @type({ map: "number" }) public position: MapSchema<number> = new MapSchema<number>();
}
