import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotel, ReservationResponse } from '../../models/models';
import { HotelService } from '../../services/api.services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {
  hotel: Hotel | null = null;
  loading = true;
  reservationForm: FormGroup;
  reserving = false;
  confirmation: ReservationResponse | null = null;
  error = '';

  roomTypes = ['Habitación Estándar', 'Habitación Deluxe', 'Suite Junior', 'Suite Master', 'Villa Privada'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    const user = this.authService.getUser();
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      guestName: [user?.name || '', Validators.required],
      guestEmail: [user?.email || '', [Validators.required, Validators.email]],
      checkIn: [today, Validators.required],
      checkOut: [tomorrow, Validators.required],
      guests: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      roomType: [this.roomTypes[0], Validators.required]
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hotelService.getById(id).subscribe({
      next: (hotel) => { this.hotel = hotel; this.loading = false; },
      error: () => { this.router.navigate(['/hotels']); }
    });
  }

  get nights(): number {
    const { checkIn, checkOut } = this.reservationForm.value;
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  }

  get totalPrice(): number {
    return this.hotel ? this.nights * this.hotel.pricePerNight : 0;
  }

  reserve() {
    if (this.reservationForm.invalid || !this.hotel) return;
    this.reserving = true;
    this.error = '';
    const { guestName, guestEmail, checkIn, checkOut, guests, roomType } = this.reservationForm.value;

    this.hotelService.reserve(this.hotel.id, {
      hotelId: this.hotel.id, guestName, guestEmail,
      checkIn, checkOut, guests, roomType
    }).subscribe({
      next: (res) => { this.confirmation = res; this.reserving = false; },
      error: () => { this.error = 'Error al procesar la reserva. Intenta nuevamente.'; this.reserving = false; }
    });
  }

  getStars(count: number): string[] {
    return Array(count).fill('★');
  }
}
