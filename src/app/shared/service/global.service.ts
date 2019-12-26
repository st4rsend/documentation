import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

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

	public verbosity: number;
	public userInfo: UserInfo;
	private sqlListChanCntr: number;
	private sqlListChanBase: number = 512;
	private sqlListChanMax: number = 511;

	private statusLineCount: number;
	private statusLineCountSubject = new Subject<number>();
	public statusLineCount$ = this.statusLineCountSubject.asObservable();

	private debugFlag = new Subject<boolean>();
	public debugFlag$ = this.debugFlag.asObservable();

	private webSocketUrl: string = 'wss://st4rsend.net/ws';
	//private webSocketUrl: string = 'wss://www.st4rsend.net/ws';

  constructor() { 
		this.sqlListChanCntr= 0;
		this.userInfo = {
			UID: 0,
			Identity: "guest",
			FirstName: "firstName",
			LastName: "lastName",
			Groups: []};

	}
	public setWebSocketUrl(url: string) {
		this.webSocketUrl = url;
	}

	public getWebSocketUrl(): string {
		return this.webSocketUrl
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

	public setVerbosity(value: string) {
		this.verbosity = +value;
		console.log("Set client verbosity to: ", this.verbosity);
	}

	log(level: number, ...args: any[]) {
		if (level <= this.verbosity) {
			console.log("Msg: ", args);
		}
	}

	public setDebugFlag(flag: boolean) {
		this.debugFlag.next(flag);
	}

	public setStatusLineCount(count: number){
		this.statusLineCount = count;
		this.statusLineCountSubject.next(this.statusLineCount);
	}

	public getStatusLineCount() {
		return this.statusLineCount;
	}
}
