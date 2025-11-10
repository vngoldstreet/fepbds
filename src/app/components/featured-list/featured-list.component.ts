import { Component } from '@angular/core';

@Component({
  selector: 'app-featured-list',
  imports: [],
  templateUrl: './featured-list.component.html',
  styleUrl: './featured-list.component.css',
})
export class FeaturedListComponent {
  featuredList = [
    {
      title:
        'Bán nhà Trần Duy Hưng, Cầu Giấy - 42m2, 5 tầng, gần Big C Thăng Long',
    },
  ];
}
