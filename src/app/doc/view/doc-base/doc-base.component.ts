// Comment
import { 
	Component, 
	OnInit,
	ViewChild,
	ViewContainerRef,
	ComponentFactoryResolver,
 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { EditItemDocComponent } from '../edit-item-doc/edit-item-doc.component';

import { DocService } from '../../service/doc.service';
import { Doc } from '../../model/doc';

@Component({
  selector: 'app-doc-base',
  templateUrl: './doc-base.component.html',
  styleUrls: ['./doc-base.component.scss'],
	providers: [ DocService ],
})
export class DocBaseComponent implements OnInit {

	public editMode: boolean = false;
	public viewMode: string = "normal";

	articleEditComponentRef: any;
	@ViewChild('articleEditContainer', { static: true, read: ViewContainerRef }) EditItemDocComponent: ViewContainerRef;

  constructor(
		private route: ActivatedRoute,
		private docService: DocService,
		private resolver: ComponentFactoryResolver,
	) { 
		}

	ngOnInit() {
		this.route.paramMap.subscribe(
			params => {
				this.docService.navigate(+params.get('id'),params.get('desc'));
			}
		); 

		this.docService.articleEditRequest$.subscribe(
			article => {
				this.articleEditComponentCreate(article);
			}
		);
	}

	docEditModeSet(editMode: boolean) {
		this.editMode = editMode;
	}

	docViewModeSet(viewMode: string){
		this.viewMode = viewMode;
	}

	articleEditComponentCreate(article: Doc) {
		this.EditItemDocComponent.clear();
		const factory = this.resolver.resolveComponentFactory(EditItemDocComponent);
		this.articleEditComponentRef = this.EditItemDocComponent.createComponent(factory);
		this.articleEditComponentRef.instance.itemDoc = article;
		this.articleEditComponentRef.instance.itemDocCloseEvent.subscribe(
			value => {
				this.articleEditCloseEvent(value);
			}
		);
	}

	articleEditCloseEvent(altered: boolean) {
		this.articleEditComponentRef.destroy();
		if (altered) {
			this.docService.refresh();
		}
	}
}
