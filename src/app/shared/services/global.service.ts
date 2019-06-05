import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
	private sqlListChanCntr: number;
	private sqlListChanBase: number = 512;
	private sqlListChanMax: number = 511;

  constructor() { 
		this.sqlListChanCntr= 0;
	}

	public GetSqlListChannel() {
		this.sqlListChanCntr = this.sqlListChanCntr + 1;
		if ( this.sqlListChanCntr > this.sqlListChanMax ) {
			this.sqlListChanCntr = 1;
		}
		return this.sqlListChanCntr + this.sqlListChanBase;
	}
}
