import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TouristSite } from '../../models/models';
import { TouristSiteService } from '../../services/api.services';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  sites: TouristSite[] = [];
  categories: string[] = [];
  loading = true;
  filterForm: FormGroup;

  categoryIcons: Record<string, string> = {
    'Playa': '🏖️', 'Naturaleza': '🌿', 'Cultural': '🎭', 'Histórico': '🏛️'
  };

  constructor(private siteService: TouristSiteService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({ category: [''], province: [''] });
  }

  ngOnInit() {
    this.siteService.getCategories().subscribe(c => this.categories = c);
    this.loadSites();
    this.filterForm.valueChanges.subscribe(() => this.loadSites());
  }

  loadSites() {
    this.loading = true;
    const { category, province } = this.filterForm.value;
    this.siteService.getAll(category || undefined, province || undefined).subscribe({
      next: (data) => { this.sites = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  clearFilters() {
    this.filterForm.reset({ category: '', province: '' });
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || '📍';
  }
}
