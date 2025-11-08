import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-homepage',
  imports: [HeaderComponent, HeroComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {}
