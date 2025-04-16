import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';
import { GeocodingResult } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, WeatherDisplayComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>{{ title }}</h1>
      </header>
      
      <main>
        <app-search-bar (citySelected)="onCitySelected($event)"></app-search-bar>
        <app-weather-display [selectedCity]="selectedCity"></app-weather-display>
      </main>
      
      <footer>
        <p>Application météo</p>
      </footer>
    </div>
  `,
  styles: `
    .app-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #2196F3;
      margin: 0;
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  `
})
export class AppComponent {
  title = 'WEATHER APP';
  selectedCity: GeocodingResult | null = null;
  
  onCitySelected(city: GeocodingResult): void {
    this.selectedCity = city;
  }
}
