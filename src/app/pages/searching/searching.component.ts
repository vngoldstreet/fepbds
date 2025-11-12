import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

export interface PropertyItem {
  id: string;
  title: string;
  price: number; // đơn vị: tỷ
  lat: number;
  lng: number;
  district?: string;
  ward?: string;
  area_m2?: number;
  thumbnail?: string;
}

@Component({
  selector: 'app-searching',
  imports: [],
  templateUrl: './searching.component.html',
  styleUrl: './searching.component.css',
})
export class SearchingComponent {
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const el = document.getElementById('map');
      if (!el) {
        console.error('Không tìm thấy phần tử #map');
        return;
      }

      const map = new maplibregl.Map({
        container: el,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [105.85, 21.03],
        zoom: 12,
      });

      new maplibregl.Marker({ color: '#2563EB' })
        .setLngLat([105.85, 21.03])
        .setPopup(
          new maplibregl.Popup().setHTML('<b>Hồ Gươm</b><br/>Giá 8.5 tỷ')
        )
        .addTo(map);

      map.resize(); // ✅ quan trọng để vẽ lại khi container xuất hiện
    }, 200);
  }
}
