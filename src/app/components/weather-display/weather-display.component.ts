import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherResult, GeocodingResult } from '../../services/weather.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})

export class WeatherDisplayComponent implements OnChanges {
  @Input() selectedCity: GeocodingResult | null = null;
  
  weatherData: WeatherResult | null = null;
  loading = false;
  errorMessage = '';
  
  constructor(private weatherService: WeatherService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCity'] && this.selectedCity) {
      console.log('Ville sélectionnée changée:', this.selectedCity.name);
      this.weatherData = null;
      this.getWeatherData();
    }
  }
  
  getWeatherData(): void {
    if (!this.selectedCity) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.weatherService.getWeather(
      this.selectedCity.latitude,
      this.selectedCity.longitude,
      this.selectedCity.name
    ).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de récupérer les données météo. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur lors de la récupération des données météo', error);
      }
    });
  }

  
}
