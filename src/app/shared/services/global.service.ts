import { Injectable } from '@angular/core';

interface UserGroups {
	GroupID: number;
	GroupDescription: string;
	GroupPosition: number;
}

interface UserInfo {
	USerID: number;
	UserIdentity: string;
	USerFirstName: string;
	UserLastName: string;
	UserGroup: UserGroups[];
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

	public userInfo: UserInfo;
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
