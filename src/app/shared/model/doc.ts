export interface IDoc {
	idx: number;
	position: number;
	description: string;
	typeID: number;
	typeValue: string;
	value: string;
	childListID: number;
	type2ID: number;
	type2Value: string;
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
		public type2Value: string,
		public value2: string,
		public child2ListID: number,
		public displayID: number,
		public display: string,
	){}
}
