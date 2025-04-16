import { Injectable } from '@angular/core'; // permet de rendre le service injectable dans d'autres components
import { HttpClient } from '@angular/common/http'; // pour faire des requêtes HTTP
import { Observable, of } from 'rxjs'; // les Observables, c'est la base pour gérer les requêtes async
import { map, catchError } from 'rxjs/operators'; // opérateurs pr transformer ou gérer les erreurs dans les flux

// Interfaces pour typer les données
export interface GeocodingResult {
  name: string; // nom de la ville
  latitude: number; // sa latitude
  longitude: number; // sa longitude
  country: string; // le pays
}

export interface WeatherResult {
  temperature: number; // température actuelle
  windspeed: number; // vitesse du vent
  city: string; // nom de la ville (on le garde nous-mm ici)
}

@Injectable({
  providedIn: 'root' // le service est dispo globalement dans toute l'appli
})
export class WeatherService {
  private geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search'; // URL pr chercher une ville
  private weatherUrl = 'https://api.open-meteo.com/v1/forecast'; // URL pr récupérer la météo

  constructor(private http: HttpClient) { } // on injecte HttpClient pour faire les appels API

  // Recherche une ville par son nom
  searchCity(cityName: string): Observable<GeocodingResult[]> {
    // on construit l'URL avec le nom de la ville (bien encodé)
    const url = `${this.geocodingUrl}?name=${encodeURIComponent(cityName)}`;
    
    return this.http.get<any>(url).pipe( // on fait une requête GET
      map(response => { // on traite la réponse
        if (response && response.results) {
          // si on a des résultats, on les transforme avec map
          return response.results.map((result: any) => ({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            country: result.country
          }));
        }
        return []; // si pas de résultats, on retourne un tableau vide
      })
    );
  }

  // Récupère les données météo pour une ville
  getWeather(latitude: number, longitude: number, cityName: string): Observable<WeatherResult> {
    // on construit l'URL avec les coordonnées + current_weather=true pour avoir les infos actuelles
    const url = `${this.weatherUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    
    return this.http.get<any>(url).pipe( // on fait la requête GET
      map(response => {
        if (response && response.current_weather) {
          // si la réponse est bonne, on extrait les infos utiles
          return {
            temperature: response.current_weather.temperature,
            windspeed: response.current_weather.windspeed,
            city: cityName // on ajoute la ville (qu'on avait déjà en paramètre)
          };
        }
        throw new Error('Données météo non disponibles'); // si y’a rien, on lève une erreur
      })
    );
  }
}
