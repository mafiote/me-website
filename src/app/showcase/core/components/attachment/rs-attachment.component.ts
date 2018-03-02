import { RsFileGetInfo } from '../../http/rs-file.service';
import { Component, Input, OnInit } from '@angular/core';

import { RsFileService } from '../../http/index';
import { SCREEN } from '../../routing/screen';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'rs-attachment',
    templateUrl: 'rs-attachment.component.html',
    styleUrls: ["rs-attachment.component.scss"]
})

export class RsAttachmentComponent implements OnInit {

    files: RsFileGetInfo[] = [];

    @Input() showTitle: boolean = false;
    @Input() title: string = 'COMMON.ATTACHMENT.TITLE';

    @Input() refId: string = '';
    @Input() screenCode: string = '';

    @Input() filter: string = null;

    myfile: any[];
    inProgressGetList: boolean = false;

    constructor(
        public fileService: RsFileService
    ) { }

    ngOnInit() {
        this.getFiles();
    }

    async getFiles() {
        this.inProgressGetList = true;
        this.files = await this.fileService.get(this.refId, this.screenCode).toPromise();
        this.inProgressGetList = false;
    }

    download(file: RsFileGetInfo) {
        file.inProgress = true;
        this.fileService.download(file.id).subscribe(
            (res) => {
                const downloadName = file.originalName + '.' + file.extension;
                FileSaver.saveAs(res, downloadName);
                file.inProgress = false;
            },
            (err) => {
                file.inProgress = false;
                console.log(err);
            }
        );
    }

    upload(event, fileObj) {
        this.fileService.upload(this.refId, this.screenCode, event.files[0]).subscribe(
            (res) => {
                this.getFiles();
                fileObj.clear();
            },
            (err) => {
                console.log(err);
                fileObj.clear();
            }
        );
    }

    delFile(id: string) {
        this.fileService.del(id).subscribe(
            (res) => {
                const index = this.files.findIndex(s => s.id === id);
                if (index > -1) {
                    this.files = this.files.splice(index, 1);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

}