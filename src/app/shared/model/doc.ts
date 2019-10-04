/*
export interface IDoc {
	idx: number;
	typeID: number;
	typeValue: string;
	position: number;
	value: string;
	description: string;
	childListID: number;
	type2ID: number;
	type2value: string;
	value2: string;
	child2ListID: number;
}

export class Doc implements IDoc {
	constructor (
		public idx: number,
		public typeID: number,
		public typeValue: string,
		public position: number,
		public value: string,
		public description: string,
		public childListID: number,
		public type2ID: number,
		public type2value: string,
		public value2: string,
		public child2ListID: number,
	){}
}
*/
export interface IDoc {
	idx: number;
	position: number;
	description: string;
	typeID: number;
	typeValue: string;
	value: string;
	childListID: number;
	type2ID: number;
	type2value: string;
	value2: string;
	child2ListID: number;
	displayID: number;
	display: string;
}

export class Doc implements IDoc {
	constructor (
		public idx: number,
		public position: number,
		public description: string,
		public typeID: number,
		public typeValue: string,
		public value: string,
		public childListID: number,
		public type2ID: number,
		public type2value: string,
		public value2: string,
		public child2ListID: number,
		public displayID: number,
		public display: string,
	){}
}

export interface IDocList {
	idx: string;
	value: string;
}
export class DocList implements IDocList {
	constructor (
		public idx: string,
		public value: string
	){}
}
export interface IDocType {
	idx: string;
	value: string;
}
export class DocType implements IDocType {
	constructor (
		public idx: string,
		public value: string
	){}
}
