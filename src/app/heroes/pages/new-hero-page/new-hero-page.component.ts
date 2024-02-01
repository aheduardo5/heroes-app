import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { HeroesService } from '../../services/heros.service';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

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
    private snackbar: MatSnackBar,
    private dialog: MatDialog
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
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //TODO : Show snackbar
        this.showSnackBar(`${hero.superhero} has been updated`);
        this.router.navigateByUrl('/heroes/list');
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      // TODO: Show snackbar and navigate to /heroes/edit/hero.id
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackBar(`${hero.superhero} has been added`);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero Id is required');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.router.navigateByUrl('/heroes/list');
      });
  }

  showSnackBar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }

  onReturn(): void {
    this.router.navigateByUrl('heroes/list');
  }
}
