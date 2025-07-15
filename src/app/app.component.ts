import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgencyService } from './agency.service';
import { DropdownModule } from 'primeng/dropdown';

// สำหรับ Export Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    HttpClientModule,
    DropdownModule,
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('exportTable', { static: false }) exportTable!: ElementRef;

  title = 'my-primeng-app';
  searchCode = '';
  searchName = '';
  searchTier: string = '';
  result = '';
  agencies: any[] = [];
  newName = '';
  newCode = '';
  newTier = '';
  currentId: number | null = null;

  tierOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `ระดับ ${i + 1}`,
    value: `ระดับ ${i + 1}`,
  }));

  constructor(private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.onSearch();
  }

  refreshPage() {
    window.location.reload();
  }

  exportExcel() {
  const exportData = this.agencies.map((a, i) => ({
    ลำดับ: i + 1,
    ชื่อหน่วยงาน: a.name,
    รหัสศูนย์ต้นทุน: a.code,
    ระดับ: a.tier
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'หน่วยงาน');

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const data: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  saveAs(data, 'ข้อมูลหน่วยงาน.xlsx');
}


  onSearch() {
    const name = this.searchName.trim().toLowerCase();
    const code = this.searchCode.trim().toLowerCase();
    const tier = this.searchTier;

    this.agencyService.getAll().subscribe(
      (data: any) => {
        let filtered = data;

        if (code) {
          filtered = filtered.filter((a: any) => a.code?.toLowerCase().includes(code));
        }

        if (name) {
          filtered = filtered.filter((a: any) => a.name?.toLowerCase().includes(name));
        }

        if (tier) {
          filtered = filtered.filter((a: any) => a.tier === tier);
        }

        this.agencies = filtered;
        this.result = `พบข้อมูล ${this.agencies.length} รายการ`;
      },
      () => {
        this.result = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
        this.agencies = [];
      }
    );
  }

  onClear() {
    this.searchCode = '';
    this.searchName = '';
    this.searchTier = '';
    this.result = '';
    this.agencies = [];
    this.newName = '';
    this.newCode = '';
    this.newTier = '';
    this.currentId = null;
    this.onSearch();
  }

  onAddOrUpdate() {
    const dept = { name: this.newName, code: this.newCode, tier: this.newTier };

    if (this.currentId) {
      this.agencyService.update(this.currentId, dept).subscribe(
        () => {
          this.onSearch();
          this.resetForm();
        },
        () => alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล')
      );
    } else {
      this.agencyService.create(dept).subscribe(
        () => {
          this.onSearch();
          this.resetForm();
        },
        () => alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล')
      );
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
      this.agencyService.delete(id).subscribe(
        () => this.onSearch(),
        () => alert('เกิดข้อผิดพลาดในการลบข้อมูล')
      );
    }
  }

  private resetForm() {
    this.newName = '';
    this.newCode = '';
    this.newTier = '';
    this.currentId = null;
  }
}
