import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import type * as maplibregl from 'maplibre-gl';
import { environment } from '../../enviroments';

@Component({
  selector: 'app-searching',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searching.component.html',
  styleUrl: './searching.component.css',
})
export class SearchingComponent {
  private http = inject(HttpClient);
  // SSR guard
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // compute isBrowser after platformId is available
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  map: maplibregl.Map | null = null;
  posts: any[] = [];
  isMapLoaded = false;
  isBrowser = false;

  ngOnInit() {
    // Chỉ fetch khi chạy trên browser (tránh lỗi SSR)
    if (this.isBrowser) {
      this.fetchData();
    }
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;
    await this.initMap();
  }

  private async initMap() {
    // dynamic import để tránh lỗi "window is not defined" trên SSR
    const maplibre = await import('maplibre-gl');

    this.map = new maplibre.Map({
      container: 'map',
      style: environment.MAPS,
      center: [105.8342, 21.0278], // Hà Nội
      zoom: 12,
    });

    this.map.addControl(
      new maplibre.NavigationControl({ showCompass: false }),
      'top-right'
    );

    this.map.on('load', () => {
      this.isMapLoaded = true;
      console.log('[PBDS] Map loaded');
      this.renderMarkers(maplibre);
    });
  }

  private fetchData() {
    this.http.get(`${environment.API_BASE}/${environment.POSTS}`).subscribe({
      next: (res: any) => {
        this.posts = res?.data?.hits || [];
        console.log('[PBDS] posts loaded:', this.posts.length);

        // Sau khi có data mà map đã load rồi thì vẽ marker
        if (this.isMapLoaded && this.map) {
          this.renderMarkers();
        }
      },
      error: (err) => {
        console.error('[PBDS] search error', err);
      },
    });
  }

  private async renderMarkers(maplibreParam?: typeof maplibregl) {
    if (!this.map || !this.posts.length) return;

    const maplibre = maplibreParam || (await import('maplibre-gl'));

    // Clear old markers
    const anyMap = this.map as any;
    if (anyMap._markers && Array.isArray(anyMap._markers)) {
      anyMap._markers.forEach((m: any) => m.remove());
    }
    anyMap._markers = [];

    const bounds = new maplibre.LngLatBounds();

    this.posts.forEach((p) => {
      if (typeof p.lng !== 'number' || typeof p.lat !== 'number') return;

      const marker = new maplibre.Marker({
        color: '#2563EB',
      })
        .setLngLat([p.lng, p.lat])
        .setPopup(
          new maplibre.Popup({ offset: 15 }).setHTML(this.renderPopup(p))
        )
        .addTo(this.map!);

      anyMap._markers.push(marker);
      bounds.extend([p.lng, p.lat]);
    });

    if (this.posts.length > 1) {
      this.map.fitBounds(bounds, { padding: 40 });
    } else if (this.posts.length === 1) {
      this.map.setCenter([this.posts[0].lng, this.posts[0].lat]);
      this.map.setZoom(15);
    }
  }

  private renderPopup(p: any): string {
    const priceText = `${p.price} ${p.price_unit || 'tỷ'}`;
    const addr = [p.street_name, p.ward, p.district].filter(Boolean).join(', ');

    return `
      <div style="width: 220px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;">
        <div style="width: 100%; height: 120px; border-radius: 10px; overflow: hidden; background:#f1f5f9;">
          <img src="${p.images?.[0] || 'https://placehold.co/300x200'}"
               style="width: 100%; height: 100%; object-fit: cover;" />
        </div>

        <div style="margin-top: 8px; font-weight: 600; font-size: 14px; color: #0f172a; line-height: 1.3;">
          ${p.title}
        </div>

        <div style="margin-top: 4px; font-size: 12px; color: #64748b;">
          📍 ${addr}
        </div>

        <div style="margin-top: 8px; font-size: 15px; font-weight: 700; color: #2563eb;">
          ${priceText}
        </div>
      </div>
    `;
  }
  focusPost(p: any) {
    if (!this.map || typeof p.lng !== 'number' || typeof p.lat !== 'number')
      return;
    console.log(p);

    this.map.flyTo({
      center: [p.lng, p.lat],
      zoom: 16,
      speed: 1.2,
    });
  }
}
