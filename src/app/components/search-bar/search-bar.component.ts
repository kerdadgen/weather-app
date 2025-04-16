import { Component, OnInit, Output, EventEmitter } from '@angular/core'; // trucs de base d'angular pour les components
import { CommonModule } from '@angular/common'; // module commun pr utiliser *ngIf etc.
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // pour gerer les forms réactif (pas les template-driven)
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators'; // opérateurs pour gérer les flux d'event
import { EMPTY } from 'rxjs'; // un flux vide pr stopper un process cleanement

import { WeatherService, GeocodingResult } from '../../services/weather.service'; // on importe notre service meteo + le type qu'on va utiliser

@Component({
  selector: 'app-search-bar', // le nom qu'on va utiliser dans le html genre <app-search-bar>
  standalone: true, // ce component peut fonctionner tout seul (sans module)
  imports: [CommonModule, ReactiveFormsModule], // les modules nécessaires pour le HTML et le formControl
  templateUrl: './search-bar.component.html', // fichier html associé
  styleUrls: ['./search-bar.component.css'] // css pr styliser le component
})
export class SearchBarComponent implements OnInit {
  searchControl = new FormControl(''); // le champ de recherche, initialisé vide
  cities: GeocodingResult[] = []; // tableau de résultats des villes qu'on va remplir avec les réponses de l'api
  loading = false; // booléen pour afficher un spinner ou bloquer le champ pendant la recherche
  
  @Output() citySelected = new EventEmitter<GeocodingResult>(); // output pr envoyer la ville choisie au parent (genre AppComponent)
  
  constructor(private weatherService: WeatherService) {} // on injecte le service meteo ici

  ngOnInit(): void {
    // ici on écoute les changements de valeur dans le champ de recherche
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(), // si l'utilisateur tape la mm chose, on relance pas la requete
      tap(() => {
        this.loading = true; // on active le spinner/loading
        this.cities = []; // on vide les résultats précédent
      }),
      switchMap(cityName => { // switchMap permet d'annuler la requête précédente si une nouvelle arrive
        if (!cityName) { // si l'input est vide
          this.loading = false; // plus besoin de loader
          return EMPTY; // on retourne rien
        }
        return this.weatherService.searchCity(cityName).pipe( // sinon on appelle le service pr chercher les villes
          catchError(() => { // si y'a une erreur (genre pb réseau)
            this.loading = false; // on désactive le loading
            return EMPTY; // on retourne un flux vide
          })
        );
      })
    ).subscribe(results => { // quand on recoit les résultats
      this.cities = results; // on les stocke dans notre tableau
      this.loading = false; // on arrête le spinner
    });
  }

  selectCity(city: GeocodingResult): void {
    this.citySelected.emit(city); // on envoie la ville choisie au composant parent
    this.cities = []; // on vide la liste des villes
    this.searchControl.setValue('', { emitEvent: false }); // on vide le champ sans relancer une nouvelle recherche
  }
}
