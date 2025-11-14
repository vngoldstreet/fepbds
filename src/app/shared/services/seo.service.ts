import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private platformId: Object;
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  /**
   * Cập nhật tiêu đề trang
   * @param titleValue Tiêu đề mới
   */
  updateTitle(titleValue: string) {
    this.title.setTitle(titleValue);
  }

  /**
   * Cập nhật toàn bộ các thẻ meta
   * @param tags Các cặp key-value đại diện cho tên và nội dung của meta tag
   */
  updateMetaTags(tags: { [key: string]: string }) {
    for (const key in tags) {
      if (tags.hasOwnProperty(key)) {
        this.meta.updateTag({ name: key, content: tags[key] });
      }
    }
  }

  /**
   * Cập nhật Open Graph meta tags
   * @param ogTags Các cặp key-value đại diện cho thuộc tính và nội dung của Open Graph meta tag
   */
  updateOpenGraphTags(ogTags: { [property: string]: string }) {
    for (const property in ogTags) {
      if (ogTags.hasOwnProperty(property)) {
        this.meta.updateTag({
          property: `og:${property}`,
          content: ogTags[property],
        });
      }
    }
  }

  updateTwitterOpenGraphTags(ogTags: { [property: string]: string }) {
    for (const property in ogTags) {
      if (ogTags.hasOwnProperty(property)) {
        this.meta.updateTag({
          name: `twitter:${property}`,
          content: ogTags[property],
        });
      }
    }
  }

  /**
   * Xóa một thẻ meta
   * @param name Tên của thẻ meta cần xóa
   */
  removeMetaTag(name: string) {
    this.meta.removeTag(`name='${name}'`);
  }

  setCanonicalURL(url?: string): void {
    const canonicalUrl = url || window.location.href;
    // Xóa thẻ canonical cũ nếu có
    if (isPlatformBrowser(this.platformId)) {
      const existingLink = document.querySelector("link[rel='canonical']");
      if (existingLink) {
        existingLink.remove();
      }

      // Tạo và thêm thẻ canonical mới
      const link: HTMLLinkElement = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      document.head.appendChild(link);
    }
  }
}
