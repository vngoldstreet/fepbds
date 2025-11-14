import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  constructor(private uploadService: UploadService) {}
  imageUrl = '';
  // async onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (!file) return;

  //   // 1. Gọi backend để tạo presigned URL
  //   this.uploadService
  //     .getPresign(`posts/${Date.now()}_${file.name}`, file.type)
  //     .subscribe((res) => {
  //       const presignUrl = res.data.url;
  //       console.log(presignUrl);

  //       // 2. Upload trực tiếp lên Minio
  //       this.uploadService.uploadToMinio(presignUrl, file);
  //     });
  // }
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploadService
      .getPresign(`posts/${Date.now()}_${file.name}`, file.type)
      .subscribe(async (res) => {
        const presignUrl = res.data.url;

        // Upload
        const publicUrl = await this.uploadService.uploadToMinio(
          presignUrl,
          file
        );

        // Lưu URL ảnh để hiển thị
        this.imageUrl = publicUrl;
      });
  }
}
