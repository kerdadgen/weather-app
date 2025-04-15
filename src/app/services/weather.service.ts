import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Interfaces pour typer les données
export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface WeatherResult {
  temperature: number;
  windspeed: number;
  weathercode: number;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private weatherUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) { }

  // Recherche une ville par son nom
  searchCity(cityName: string): Observable<GeocodingResult[]> {
    if (!cityName.trim()) {
      return of([]);
    }
    
    const url = `${this.geocodingUrl}?name=${encodeURIComponent(cityName)}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.results) {
          return response.results.map((result: any) => ({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            country: result.country
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Erreur lors de la recherche de la ville', error);
        return of([]);
      })
    );
  }

  // Récupère les données météo pour une ville
  getWeather(latitude: number, longitude: number, cityName: string): Observable<WeatherResult> {
    const url = `${this.weatherUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.current_weather) {
          return {
            temperature: response.current_weather.temperature,
            windspeed: response.current_weather.windspeed,
            weathercode: response.current_weather.weathercode,
            city: cityName
          };
        }
        throw new Error('Données météo non disponibles');
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des données météo', error);
        throw error;
      })
    );
  }
}
