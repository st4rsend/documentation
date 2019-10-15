import { Component } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';

@Component({
  selector: 'app-doc-base',
  templateUrl: './doc-base.component.html',
  styleUrls: ['./doc-base.component.scss'],
	providers: [ DocService ],
})
export class DocBaseComponent {

	public editMode: boolean = false;
	public viewMode: string = "normal";
	public newItemTrigger: boolean = false;

  constructor(
		private DocService: DocService,
	) { }

	docEditModeSet(editMode: boolean) {
		this.editMode = editMode;
	}

	newItem() {
		this.newItemTrigger = !this.newItemTrigger;
	}

	docViewModeSet(viewMode: string){
		this.viewMode = viewMode;
	}
}
