// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.36
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Piece } from './Piece'

export class Player extends Schema {
    @type("string") public name!: string;
    @type([ Piece ]) public hand: ArraySchema<Piece> = new ArraySchema<Piece>();
    @type("boolean") public isVIP!: boolean;
    @type("string") public status!: string;
    @type([ Piece ]) public submission: ArraySchema<Piece> = new ArraySchema<Piece>();
}
