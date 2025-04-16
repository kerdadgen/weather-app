import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'; // imports pr créer un component Angular et gérer les changements d'inputs
import { CommonModule } from '@angular/common'; // module commun, nécessaire pour les directives comme ngIf, ngFor
import { WeatherResult, GeocodingResult } from '../../services/weather.service'; // on importe les types qu'on a défini dans le service
import { WeatherService } from '../../services/weather.service'; // on importe le service météo

@Component({
  selector: 'app-weather-display', // nom du composant qu’on utilise dans le HTML parent
  standalone: true, // composant standalone (pas besoin d'être dans un module)
  imports: [CommonModule], // on importe le module commun pr pouvoir utiliser les trucs de base comme *ngIf
  templateUrl: './weather-display.component.html', // chemin vers le fichier HTML lié
  styleUrls: ['./weather-display.component.css'] // styles associés
})
export class WeatherDisplayComponent implements OnChanges {
  @Input() selectedCity: GeocodingResult | null = null; // la ville sélectionnée qu'on recoit en input

  weatherData: WeatherResult | null = null; // ici on stockera les infos météo
  loading = false; // pr afficher un indicateur de chargement
  errorMessage = ''; // pr afficher un msg d'erreur si besoin

  constructor(private weatherService: WeatherService) {} // on injecte le service météo

  // appelé à chaque fois que les inputs changent
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCity'] && this.selectedCity) {
      console.log('Ville sélectionnée changée:', this.selectedCity.name); // log dans la console (debug)
      this.weatherData = null; // on reset les anciennes données météo
      this.getWeatherData(); // on appelle la fct pr charger les nouvelles données
    }
  }

  // fonction qui va appeler le service météo
  getWeatherData(): void {
    if (!this.selectedCity) return; // si y'a pas de ville, on fait rien

    this.loading = true; // on passe en mode "chargement"
    this.errorMessage = ''; // on vide le msg d'erreur précédent

    // appel au service météo avec les coordonnées de la ville
    this.weatherService.getWeather(
      this.selectedCity.latitude,
      this.selectedCity.longitude,
      this.selectedCity.name
    ).subscribe({
      next: (data) => {
        this.weatherData = data; // on stocke les données reçues
        this.loading = false; // fin du chargement
      },
      error: (error) => {
        this.errorMessage = 'Impossible de récupérer les données météo. Veuillez réessayer.'; // msg affiché à l'utilisateur
        this.loading = false; // on stoppe le chargement
        console.error('Erreur lors de la récupération des données météo', error); // on affiche l'erreur pr debug
      }
    });
  }
}
