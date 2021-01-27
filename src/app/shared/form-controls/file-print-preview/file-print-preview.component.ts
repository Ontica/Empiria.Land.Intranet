import { Component, Input } from '@angular/core';
import { PrinterService } from '@app/shared/utils/printer.service';
import { MediaType } from '@app/models';

@Component({
  selector: 'emp-ng-file-print-preview',
  templateUrl: './file-print-preview.component.html',
  styleUrls: ['./file-print-preview.component.scss']
})
export class FilePrintPreviewComponent {

  @Input() title: string;

  @Input() hint: string;

  display: boolean = false;

  url: string = null;

  constructor(private printerService: PrinterService) { }

  open(url, type){
    if (this.validUrl(url)){

      if (type === MediaType.html){

        this.printerService.printFile(url);

        return;
      }

      this.url = url;

      this.display = true;
    }
  }

  validUrl(url: string){
    return url !== null && url !== undefined && url !== '';
  }

  onClose(){
    this.url = null;
    this.display = false;
  }

}
