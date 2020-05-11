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

export interface IArticleShort {
	idx: number;
	position: number;
	description: string;
}
export class ArticleShort implements IArticleShort {
	constructor (
		public idx: number,
		public position: number,
		public description: string,
	){}
}

export interface INavElement {
	idx: number;
	description: string;
}

export class NavElement implements INavElement {
	constructor (
		public idx: number,
		public description: string,
	){}
}

export class NavHistory {
	private navStack: Array<NavElement>;
	private index: number;

	constructor() {
		this.index = 0;
		this.navStack = [];
	}

	public size() {
		return this.index;
	}

	public push(element) {
		this.navStack[this.index] = element;
		this.index = this.index + 1;
	}

	public pop() {
		if (this.index > 0) {
			this.index = this.index - 1;
			return this.navStack.pop();
		} else {
			return this.navStack[0];
		}
	}

	public back() {
		this.pop();
		return this.pop();
	}

	public last() {
		return this.navStack[this.index-1];
	}

	public isEmpty() {
		return this.index === 0;
	}

	public getListFromLast() {
		var cursor = this.index - 1;
		var list: Array<NavElement> = [];
		while (cursor >= 0) {
			list[this.index - cursor -1] = this.navStack[cursor];
			cursor--;
		}
		return list;
	}
	public getListFromStart() {
		var cursor = 0;
		var list: Array<NavElement> = [];
		while (cursor < this.index) {
			list[cursor] = this.navStack[cursor];
			cursor++;
		}
		return list;
	}
}
