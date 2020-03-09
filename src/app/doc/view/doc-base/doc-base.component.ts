import { Component } from '@angular/core';
import { DocService } from '../../service/doc.service';

@Component({
  selector: 'app-doc-base',
  templateUrl: './doc-base.component.html',
  styleUrls: ['./doc-base.component.scss'],
	providers: [ DocService ],
})
export class DocBaseComponent {

	public editMode: boolean = false;
	public viewMode: string = "normal";
	public newArticleTrigger: boolean = false;

  constructor(
		private DocService: DocService,
	) { }

	docEditModeSet(editMode: boolean) {
		this.editMode = editMode;
	}

	newArticle(flag: boolean) {
		this.newArticleTrigger = flag;
	}

	docViewModeSet(viewMode: string){
		this.viewMode = viewMode;
	}
	resetArticleTriggerEvent(){
		// TODO: Generate bug ... TO BE FIXED
		//this.newArticleTrigger = false;
	}
}
