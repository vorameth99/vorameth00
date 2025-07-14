import { Component, OnInit } from '@angular/core'; // ✅ import OnInit
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgencyService } from './agency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    HttpClientModule
  ]
})
export class AppComponent implements OnInit { // ✅ implements OnInit
  title = 'my-primeng-app';
  searchCode = '';
  searchName = '';
  result = '';
  agencies: any[] = [];
  newName = '';
  newTier = '';
  newCode = '';
  currentId: number | null = null;

  constructor(private agencyService: AgencyService) {}

  // ✅ แสดงข้อมูลทันทีเมื่อเปิดเว็บ
  ngOnInit(): void {
    this.onSearch();
  }

  onSearch() {
    const code = this.searchCode.trim();
    const name = this.searchName.trim();

    if (!code && !name) {
      // ไม่กรอกอะไรเลย ให้ดึงข้อมูลทั้งหมด
      this.agencyService.getAll().subscribe({
        next: (data: any) => {
          this.agencies = Array.isArray(data) ? data : [];
          this.result = `พบข้อมูล ${this.agencies.length} รายการ`;
        },
        error: () => {
          this.result = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
          this.agencies = [];
        }
      });
    } else {
      // ค้นหาแบบกรองข้อมูลจาก code หรือ name
      const keyword = code || name;
      this.agencyService.search(keyword).subscribe({
        next: (data: any) => {
          this.agencies = Array.isArray(data) ? data : [];
          this.result = `พบข้อมูล ${this.agencies.length} รายการ`;
        },
        error: () => {
          this.result = 'เกิดข้อผิดพลาดในการค้นหา';
          this.agencies = [];
        }
      });
    }
  }

  onClear() {
    this.searchCode = '';
    this.searchName = '';
    this.result = '';
    this.agencies = [];
    this.newName = '';
    this.newCode = '';
    this.newTier = '';
    this.currentId = null;
    this.onSearch(); // ✅ เพิ่มเพื่อโหลดข้อมูลใหม่
  }

  onAddOrUpdate() {
    const dept = { name: this.newName, code: this.newCode, tier: this.newTier };
    console.log('กำลังส่งข้อมูล:', dept);

    if (this.currentId) {
      this.agencyService.update(this.currentId, dept).subscribe({
        next: () => {
          this.onSearch();
          this.resetForm();
        },
        error: () => alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล')
      });
    } else {
      this.agencyService.create(dept).subscribe({
        next: () => {
          this.onSearch();
          this.resetForm();
        },
        error: () => alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล')
      });
    }
  }

  onEdit(agency: any) {
    this.currentId = agency.id;
    this.newName = agency.name;
    this.newCode = agency.code;
    this.newTier = agency.tier;
  }

  onDelete(id: number) {
    if (confirm('คุณแน่ใจว่าต้องการลบรายการนี้หรือไม่?')) {
      this.agencyService.delete(id).subscribe({
        next: () => this.onSearch(),
        error: () => alert('เกิดข้อผิดพลาดในการลบข้อมูล')
      });
    }
  }

  private resetForm() {
    this.newName = '';
    this.newCode = '';
    this.newTier = '';
    this.currentId = null;
  }
}
