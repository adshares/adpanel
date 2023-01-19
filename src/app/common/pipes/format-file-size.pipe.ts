import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFileSize',
})
export class FormatFileSizePipe implements PipeTransform {
  transform(fileSize: number): string {
    if (fileSize < 1024) {
      return `${fileSize} B`;
    }
    fileSize = Math.floor(fileSize / 1024);
    if (fileSize < 1024) {
      return `${fileSize} KB`;
    }
    fileSize /= 1024;
    return fileSize >= 10 ? `${Math.floor(fileSize)} MB` : `${Math.floor(fileSize * 10) / 10} MB`;
  }
}
