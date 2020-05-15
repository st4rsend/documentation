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

export class NavAncestors {
	private navStack: Array<NavElement>;
	private count: number;
	
	constructor() {
		this.count =  0;
		this.navStack =  [];
	}

	public size() {
		return this.count;
	}

	public push(element: NavElement) {
		this.navStack[this.count] = element;
		this.count = this.count + 1;
	}

	public flush() {
		while (this.count > 0) {
			this.navStack.pop();
			this.count--;
		}
	}

	public getAncestors() {
		var index = 0;
		var list: Array<NavElement> = [];
		while (index < this.count) {
			list[index] = this.navStack[index];
			index++;
		}
		return list;
	}
}

export class NavHistory {
	private navStack: Array<NavElement>;
	private count: number;
	private cursor: number;

	constructor() {
		this.count = 0;
		this.cursor = -1;
		this.navStack = [];
	}

	public size() {
		return this.count;
	}

	private push(element: NavElement) {
		this.navStack[this.count] = element;
		this.count = this.count + 1;
	}

	private pop() {
		if (this.count > 0) {
			this.count = this.count - 1;
			return this.navStack.pop();
		} else {
			return undefined;
		}
	}

	public addElement(element) {
		// clean from cursor pos
		while (this.cursor < this.count- 1) {
			this.pop();
		}
		// add past cursor pos
		this.push(element);
	}

	public forward() {
		if (this.cursor < this.count - 1) {
			this.cursor++;
		}
		return  this.cursor;
	}

	public back() {
		if (this.cursor > 0) {
			this.cursor--;
		}
		return this.cursor;
	}

	public getCursor() {
		return this.cursor;
	}

	public setCursor(cursor: number) {
		if (cursor > -1 && cursor < this.count) {
			this.cursor = cursor;
		}
	}

	public toLast() {
		this.cursor = this.count - 1;
		return this.cursor;
	}

	public toFirst() {
		if (this.count > 0) {
			this.cursor = 0;
		} else {
			this.cursor = -1;
		}
		return this.cursor;
	}

	public getCurrentElement(){
		if (this.cursor >= 0) {
			return this.navStack[this.cursor];
		} else {
			return undefined;
		}
	}

	public getIdx(cursor: number) {
		return this.navStack[cursor].idx
	}

	public getCurrentIdx() {
		if (this.count > 0) {
			return this.navStack[this.cursor].idx;
		} else {
			return undefined;
		}
	}

	public isEmpty() {
		return this.count === 0;
	}

	public getListFromLast() {
		var index = this.count - 1;
		var list: Array<NavElement> = [];
		while (index >= 0) {
			list[this.count - index - 1] = this.navStack[index];
			index--;
		}
		return list;
	}
	public getListFromStart() {
		var index = 0;
		var list: Array<NavElement> = [];
		while (index < this.count) {
			list[index] = this.navStack[index];
			index++;
		}
		return list;
	}
}
