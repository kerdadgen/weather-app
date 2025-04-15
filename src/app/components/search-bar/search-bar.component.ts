import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { WeatherService, GeocodingResult } from '../../services/weather.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchControl = new FormControl('');
  cities: GeocodingResult[] = [];
  loading = false;
  
  @Output() citySelected = new EventEmitter<GeocodingResult>();
  
  constructor(private weatherService: WeatherService) {}
  
  ngOnInit(): void {
    // Configuration du flux réactif pour la recherche
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(), // Ne pas émettre si la valeur n'a pas changé
      tap(() => {
        this.loading = true;
        this.cities = [];
      }),
      switchMap(cityName => {
        if (!cityName) {
          this.loading = false;
          return EMPTY;
        }
        return this.weatherService.searchCity(cityName).pipe(
          catchError(() => {
            this.loading = false;
            return EMPTY;
          })
        );
      })
    ).subscribe(results => {
      this.cities = results;
      this.loading = false;
    });
  }
  
  selectCity(city: GeocodingResult): void {
    this.citySelected.emit(city);
    this.cities = [];
    this.searchControl.setValue('', { emitEvent: false });
  }
}
