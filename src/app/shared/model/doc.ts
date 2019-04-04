export interface IDoc {
	idx: number;
	typeID: number;
	typeValue: string;
	position: number;
	value: string;
}

export class Doc implements IDoc {
	constructor (
		public idx: number,
		public typeID: number,
		public typeValue: string,
		public position: number,
		public value: string
	){}
}
