// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.36
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { PromptCard } from './PromptCard'

export class PromptDeck extends Schema {
    @type([ PromptCard ]) public deck: ArraySchema<PromptCard> = new ArraySchema<PromptCard>();
}
