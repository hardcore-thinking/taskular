import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropComponent } from './drag-drop.component';

describe('DragDropComponent', () => {
	let component: DragDropComponent;
	let fixture: ComponentFixture<DragDropComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DragDropComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(DragDropComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
