import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Hotel } from '../../models/models';
import { HotelService } from '../../services/api.services';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  provinces: string[] = [];
  loading = true;
  filterForm: FormGroup;

  categories = ['Resort', 'Boutique', 'Business', 'Adults Only', 'Resort de Lujo', 'Resort Natural'];
  starOptions = [3, 4, 5];

  constructor(private hotelService: HotelService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      province: [''],
      category: [''],
      stars: ['']
    });
  }

  ngOnInit() {
    this.loadProvinces();
    this.loadHotels();
    this.filterForm.valueChanges.subscribe(() => this.loadHotels());
  }

  loadHotels() {
    this.loading = true;
    const { province, category, stars } = this.filterForm.value;
    this.hotelService.getAll(province || undefined, category || undefined, stars || undefined).subscribe({
      next: (data) => { this.hotels = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadProvinces() {
    this.hotelService.getProvinces().subscribe(p => this.provinces = p);
  }

  clearFilters() {
    this.filterForm.reset({ province: '', category: '', stars: '' });
  }

  getStars(count: number): string[] {
    return Array(count).fill('★');
  }
}
