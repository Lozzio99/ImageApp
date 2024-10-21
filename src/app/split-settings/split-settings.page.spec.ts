import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplitSettingsPage } from './split-settings.page';

describe('SplitSettingsPage', () => {
  let component: SplitSettingsPage;
  let fixture: ComponentFixture<SplitSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
