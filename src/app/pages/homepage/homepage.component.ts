import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturedListComponent } from '../../components/featured-list/featured-list.component';
import { FeaturedAreaComponent } from '../../components/featured-area/featured-area.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { HomeBlogComponent } from '../../components/home-blog/home-blog.component';

@Component({
  selector: 'app-homepage',
  imports: [
    HeroComponent,
    FeaturedListComponent,
    FeaturedAreaComponent,
    StatsComponent,
    HomeBlogComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {}
