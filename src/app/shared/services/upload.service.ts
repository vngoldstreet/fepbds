// upload.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  // Gọi API backend tạo presign URL
  getPresign(objectName: string, contentType: string) {
    return this.http.get<any>(
      `https://phobatdongsan.com.vn/v1/uploads/presign`,
      {
        params: {
          name: objectName,
          content_type: contentType,
        },
      }
    );
  }

  // async uploadToMinio(url: string, file: File) {
  //   const res = await fetch(url, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': file.type, // bắt buộc
  //     },
  //     body: file,
  //   });

  //   if (!res.ok) {
  //     const msg = await res.text();
  //     console.error('Upload failed', msg);
  //     throw new Error('Upload failed: ' + msg);
  //   }

  //   return true;
  // }
  uploadToMinio(url: string, file: File): Promise<string> {
    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    }).then((res) => {
      if (!res.ok) throw new Error('Upload failed');
      return url.split('?')[0]; // 🔥 URL public để hiển thị
    });
  }
}
