import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HeroesService } from '../../services/heros.service';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { switchMap } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-hero-page',
  templateUrl: './new-hero-page.component.html',
  styles: [],
})
export class NewHeroPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRooute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRooute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      });
  }

  onSubmit(): void {
    console.log('dentro del onsubmit');
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //TODO : Show snackbar
        this.showSnackBar(`${hero.superhero} has been updated`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      // TODO: Show snackbar and navigate to /heroes/edit/hero.id
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackBar(`${hero.superhero} has been added`);
    });
  }

  showSnackBar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
