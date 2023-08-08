import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {
  public sidebarItems = [
    {
      label:'list', icon:'label', url:'./list'
    },
    {
      label:'add hero', icon:'add', url:'./new-hero'
    },
    {
      label:'search hero', icon:'search', url:'./search'
    }
  ]
}
