import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RsHttpService } from '../http';

@Injectable()
export class RsChartJsService {

    constructor(
        private service: RsHttpService
    ) {
    }

    getFromUrl(url: string, param: any, groupField: string,
        labelField: string, valueField: string[], labels: any[]
    ): Observable<Array<any>> {

        return this.service.getUrl(param, url).map(
            (res) => {
                return this.getFromData(res, groupField, labelField, valueField, labels);
            },
            (err) => {
                console.error(err);
                return [];
            }
        );
    }

    getFromData(data: any, groupField: string,
        labelField: string, valueField: string[], labels: any[]
    ): Array<any> {
        const groups = [];

        const result: Array<any> = [];

        const groupNames: string[] = [];
        for (let i = 0; i < data.length; i++) {
            const name = data[i][groupField];
            if (groupNames.findIndex(c => c === name) === -1) {
                groupNames.push(name);
            }
        }
        // console.log(groupNames);

        // dataSet içinden ayrılan grouplara liste atamalarının yapılması.
        for (let groupIndex = 0; groupIndex < groupNames.length; groupIndex++) {
            const groupName = groupNames[groupIndex];
            const groupDataSet = data.filter((x) => x[groupField] === groupName);


            for (let valueIndex = 0; valueIndex < valueField.length; valueIndex++) {
                const value = valueField[valueIndex];
                const tempDataSet = {
                    label: groupName || value,
                    data: []
                };

                for (let labelIndex = 0; labelIndex < labels.length; labelIndex++) {
                    const label = labels[labelIndex];

                    let newVal = null;

                    const index1 = groupDataSet.findIndex(c => c[labelField] === label);
                    if (index1 > -1) {
                        newVal = groupDataSet[index1][value];
                    } else {
                        newVal = 0;
                    }

                    tempDataSet.data.push(newVal);
                }

                result.push(tempDataSet);
            }


        }

        return result;

    }

}