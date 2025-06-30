import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangingGameComponent } from './hanging-game.component';

describe('HangingGameComponent', () => {
	let component: HangingGameComponent;
	let fixture: ComponentFixture<HangingGameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HangingGameComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HangingGameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
