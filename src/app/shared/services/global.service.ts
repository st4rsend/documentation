import { Injectable } from '@angular/core';

interface UserGroup {
	GID: number;
	Description: string;
	Position: number;
}

interface UserInfo {
	UID: number;
	Identity: string;
	FirstName: string;
	LastName: string;
	Groups: UserGroup[];
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
		this.userInfo = {
			UID: 0,
			Identity: "guest",
			FirstName: "firstName",
			LastName: "lastName",
			Groups: []};
		console.log("creating GlobalService");
	}

	public GetSqlListChannel() {
		this.sqlListChanCntr = this.sqlListChanCntr + 1;
		if ( this.sqlListChanCntr > this.sqlListChanMax ) {
			this.sqlListChanCntr = 1;
		}
		return this.sqlListChanCntr + this.sqlListChanBase;
	}

	public SetUserInfo(UID: number, identity: string, firstName: string, lastName: string) {
		console.log("userInfo: ", this.userInfo);
		this.userInfo.UID = UID;
		this.userInfo.Identity = identity;
		this.userInfo.FirstName = firstName;
		this.userInfo.LastName = lastName;
		this.userInfo.Groups = [];
	}

	public AddUserGroup(GID: number, description: string, position: number) {
		this.userInfo.Groups.push({GID: GID, Description: description, Position: position});
	}

	public ResetUser() {
		this.userInfo.UID = 0;
		this.userInfo.Identity = "guest";
		this.userInfo.FirstName = "Firstname";
		this.userInfo.LastName = "Lastname";
		this.userInfo.Groups = [];
	}
}
