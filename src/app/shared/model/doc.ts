export interface IDoc {
	idx: number;
	typeID: number;
	typeValue: string;
	position: number;
	value: string;
	description: string;
}

export class Doc implements IDoc {
	constructor (
		public idx: number,
		public typeID: number,
		public typeValue: string,
		public position: number,
		public value: string,
		public description: string
	){}
}

export interface IDocList {
	id: string;
	description: string;
}

export class DocList implements IDocList {
	constructor (
		public id: string,
		public description: string
	){}
}
