import { Component, OnInit, Input } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
import {Doc} from '../../shared/model/doc';

@Component({
  selector: 'app-dyn-doc',
  templateUrl: './dyn-doc.component.html',
  styleUrls: ['./dyn-doc.component.css']
})
export class DynDocComponent implements OnInit {

	private testTexte="Hello World";
	private dynTable: Array<Doc>;
	private channelID: number = 1;

	@Input() editMode: boolean;

	public docs: Array<Doc>;

  constructor(private docService: DocService) {
	}

  ngOnInit() {
		this.docService.setChannelID(this.channelID);
		this.docSynchro();
  }

	docSynchro() {
		this.docService.SQLSynchro();
		this.docs = this.docService.getDocs();
	}
}
