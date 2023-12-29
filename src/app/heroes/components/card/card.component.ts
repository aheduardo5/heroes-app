import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: [],
})
export class CardComponent implements OnInit {
  desktopView: number = 1365;
  mobileView: number = 575;
  @Input()
  public hero!: Hero;
  isDesktop: boolean = window.innerWidth > this.desktopView;
  isMobile: boolean = window.innerWidth <= this.mobileView;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth > this.desktopView;
    this.isMobile = window.innerWidth <= this.mobileView;
  }

  ngOnInit(): void {
    if (!this.hero) throw Error('Hero property is required');
  }
}
