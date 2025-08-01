import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'ResearchGrantAnnouncementComponent',
  standalone: true,
  imports: [
    DropdownModule, DatePickerModule, FormsModule, FluidModule, ButtonModule, CommonModule,
     RouterModule
  ],
  styles: [`
    :host ::ng-deep .p-datepicker {
      width: 100% !important;
    }
  `],
  template: `
    <section class="mb-10 px-6 py-6 rounded-xl shadow bg-white">
      <h3 class="text-lg font-semibold text-gray-500 mb-6 ">
        ค้นหาข้อมูล
      </h3>
      <hr>

      <form class="flex flex-wrap gap-6" (ngSubmit)="onSearch()" autocomplete="off">
        <!-- ช่องกรอกข้อมูล -->
        <div class="flex-1 min-w-[240px] max-w-[300px] w-full flex flex-col gap-2" *ngFor="let field of fields">
          <label class="font-semibold text-black">{{ field.label }}</label>
          <p-dropdown *ngIf="!field.isDate"
                      class="w-full"
                      [options]="tierOptions"
                      placeholder="Please select"
                      optionLabel="label"
                      optionValue="value"
                      [(ngModel)]="searchTier"
                      [name]="field.name">
          </p-dropdown>

          <p-datepicker *ngIf="field.isDate"
                        [(ngModel)]="date2"
                        [showIcon]="true"
                        inputId="openDate"
                        [name]="field.name"
                        class="w-full">
          </p-datepicker>
        </div>

        <!-- ปุ่ม -->
        <div class="w-full flex justify-center items-center gap-4 mt-6">
          <button pButton type="submit" label="ค้นหา" icon="pi pi-search"
                  class="p-button p-button-danger px-6"></button>
          <button pButton type="button" label="ล้าง" icon="pi pi-refresh"
                  class="p-button p-button-outlined p-button-danger px-6"
                  (click)="onClear()"></button>
        </div>
      </form>
    </section>

    <section class="mb-10 px-6 py-6 rounded-xl shadow bg-white">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-500">
          รายการประกาศทุนวิจัย
        </h3>
        <button
          pButton
          icon="pi pi-plus"
          label="เพิ่มประกาศทุนวิจัย"
          class="p-button-sm p-button-success"
          [routerLink]="['/research-grant-announcement/add']"
        ></button>
      </div>

      <!-- วนลูปรายการทุนวิจัย -->
      <div *ngFor="let item of researchGrants" class="mb-6 p-4 border rounded shadow-sm">
  <div class="flex gap-4">
   <img [src]="item.imageUrl"
     alt="รูปทุนวิจัย"
     class="w-[300px] h-[200px] object-cover rounded-xl border border-gray-200 shadow-sm" />

    <!-- ข้อความทางขวา -->
    <div class="flex-1">
      <!-- หัวข้อ -->
      <div class="text-xl font-bold text-pink-600 leading-snug">
        {{ item.title }}
      </div>

      <!-- ปีงบ + วันที่ -->
      <div class="mt-1 text-sm text-gray-700">
        ปีงบประมาณ: <span class="text-black font-semibold">{{ item.budgetYear }}</span> | <span>{{ item.announceDate }}</span>
      </div>

      <!-- รายละเอียดทุน -->
      <div class="mt-2 text-sm text-gray-700 space-y-1">
        <div>ประเภททุน: <span class="text-black font-medium">{{ item.type }}</span></div>
        <div>จำนวนทุน: <span class="text-black font-medium">{{ item.amount }}</span></div>
        <div>วงเงินต่อทุน: <span class="text-black font-medium">{{ item.budgetPerGrant | number:'1.0-0' }} บาท</span></div>
        <div>ช่วงเวลารับสมัคร: <span class="text-black font-medium">{{ item.startDate }} - {{ item.endDate }}</span></div>
      </div>

      <!-- คำอธิบาย -->
      <div class="mt-2 text-sm text-gray-600">
        {{ item.description }}
      </div>

      <!-- ปุ่ม -->
      <div class="mt-4 flex flex-wrap gap-3">
        <button pButton label="ดาวน์โหลดเอกสาร" icon="pi pi-download" class="p-button-sm p-button-secondary"></button>
        <button pButton label="ยื่นสมัครทุนวิจัย" icon="pi pi-send" class="p-button-sm p-button-danger"></button>
      </div>

      <!-- อัปเดตล่าสุด -->
      <div class="text-xs text-gray-500 text-right mt-2">
        แก้ไขล่าสุด: {{ item.updatedAt }}
      </div>
    </div>
  </div>
</div>
    </section>
  `
})
export class ResearchGrantAnnouncementComponent {
  date2: Date | undefined;
  searchTier: string = '';

  tierOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `ตัวเลือก ${i + 1}`,
    value: `ตัวเลือก ${i + 1}`,
  }));

  fields = [
    { label: 'ประเภททุน', name: 'type', isDate: false },
    { label: 'กลุ่ม', name: 'group', isDate: false },
    { label: 'ปีงบประมาณ', name: 'budgetYear', isDate: false },
    { label: 'หมวดหมู่', name: 'category', isDate: false },
    { label: 'วันที่เปิดรับสมัคร', name: 'openDate', isDate: true },
    { label: 'สถานะการรับสมัคร', name: 'status', isDate: false },
  ];

  researchGrants = [
    {
      imageUrl: 'https://media.discordapp.net/attachments/1392047342953168997/1400406402907897856/20250710_155441.jpg?ex=688c8598&is=688b3418&hm=e16c9fe487e5a76ee11c7490694a9511c3bfc3fdd1ad44cecebdb1bd483ae3bc&=&format=webp&width=431&height=575',
      title: 'ประกาศเปิดรับข้อเสนอโครงการต้นแบบนักวิจัยไทย ประจำปีงบประมาณ 2568',
      budgetYear: '2568',
      announceDate: 'กุมภาพันธ์',
      type: 'ทุนสนับสนุนงานพื้นฐาน | Basic Research Fund',
      amount: 10,
      budgetPerGrant: 1000000,
      startDate: '01/01/2025',
      endDate: '28/02/2025',
      description: 'เปิดรับข้อเสนอโครงการวิจัยเพื่อพัฒนาองค์ความรู้และเทคโนโลยีขั้นต้นในสาขาที่ประเทศมีศักยภาพ',
      updatedAt: '13/07/2025',
    },
    {
      imageUrl: 'https://media.discordapp.net/attachments/1344330896408318013/1400406963384225803/received_1085330643698977.jpg?ex=688c861e&is=688b349e&hm=71b66bbeb370e33978f941d8bd50faaef4c3514f174571e3c9ac510adec089c8&=&format=webp&width=431&height=575',
      title: 'ประกาศเปิดรับข้อเสนอทุนพัฒนานักวิจัยหน้าใหม่ ปี 2566',
      budgetYear: '2566',
      announceDate: 'มกราคม',
      type: 'ทุนพัฒนาศักยภาพนักวิจัย',
      amount: 12,
      budgetPerGrant: 800000,
      startDate: '01/02/2025',
      endDate: '30/03/2025',
      description: 'สนับสนุนการวิจัยในระดับเริ่มต้น เพื่อสร้างนักวิจัยรุ่นใหม่เข้าสู่ระบบการวิจัยของประเทศ',
      updatedAt: '10/07/2025',
    }
  ];

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch() {
    // ดำเนินการค้นหา
  }

  onClear() {
    this.searchTier = '';
    this.date2 = undefined;
    this.onSearch();
  }
}