import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'my-primeng-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-primeng-app');
  });

  // ลบการทดสอบที่หา h1 เพราะไม่มีใน template จริง
  // สามารถเพิ่มการทดสอบสำหรับ onAdd ได้ถ้าต้องการ

  // ตัวอย่างการทดสอบ onAdd (mock service)
  // it('should add new department', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   spyOn(app.agencyService, 'create').and.returnValue(of({}));
  //   spyOn(app, 'onSearch');
  //   app.newName = 'Test';
  //   app.newCode = '001';
  //   app.onAdd();
  //   expect(app.agencyService.create).toHaveBeenCalledWith({ name: 'Test', code: '001' });
  //   expect(app.onSearch).toHaveBeenCalled();
  //   expect(app.newName).toBe('');
  //   expect(app.newCode).toBe('');
  // });
});