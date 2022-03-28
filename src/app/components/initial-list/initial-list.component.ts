import { Component, Input, Pipe } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OsfService } from 'src/app/services/osf.service';
import * as haversine from 'haversine';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecursoService } from 'src/app/services/recurso.service';
import { ActivityService } from 'src/app/services/activity.service';
import { ExcelService } from 'src/app/services/excel.service';
import { map } from 'rxjs/operators';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-initial-list',
  templateUrl: './initial-list.component.html',
  styles: [
  ]
})
export class InitialListComponent {
  searchResourceForm: FormGroup;
  searchExportForm: FormGroup;
  public bloquesData:any
  activityData: any;
  dateFrom!:string
  dateTo!:string
  resourceId!:string
  acumulador:number
  excelJsonData:any
  activityStatus!: string

  data: any;

  createSearchResourceFormFormGroup(){
    return new FormGroup({
      recursoSearch: new FormControl('')
    })
  }

  createExportFormFormGroup(){
    return new FormGroup({
      recursoId: new FormControl('', Validators.required),
      desde: new FormControl('', Validators.required),
      hasta: new FormControl('', Validators.required),
    })
  }
  

  constructor(private osf: OsfService, private recursoService: RecursoService, private excel: ExcelService, private activityService: ActivityService) {
    this.searchResourceForm = this.createSearchResourceFormFormGroup()
    this.searchExportForm = this.createExportFormFormGroup()
    this.acumulador = 0  

   }


  ngOnInit() {

    this.recursoService.getTest()
      .subscribe((response: any) => {
        this.bloquesData = response.items
        })

    
  }
  
  exportExcel(){
    this.excel.exportAsExcelFile(this.data, 'sample');
  }

  onResetForm(){
    this.searchResourceForm.reset()
    this.recursoService.getTest()
    .subscribe((response: any) => {
      this.bloquesData = response.items
      })
  }

  onResetFromList(){
    this.searchExportForm.reset()
  }

  searchResource(){
    this.bloquesData = []
    const searchResourceId = this.searchResourceForm.value.recursoSearch
    this.recursoService.getResources(searchResourceId)
      .subscribe((response: any) => {
        this.bloquesData = [response]
      })

  }

  export(){
    this.dateFrom = this.searchExportForm.value.desde
    this.dateTo = this.searchExportForm.value.hasta
    this.resourceId = this.searchExportForm.value.recursoId

    this.activityService.getActivity(this.dateFrom,this.dateTo,this.resourceId )
    .subscribe((response: any) => {
      this.activityData = response.items
      this.activityStatus = this.activityData.status
      var totalActivities = this.activityData.length - 1
      for (let index = 0; index < totalActivities; index++) {
        const element = this.activityData[index];
        var latitud1 = this.activityData[index].latitude
        var longuitud1 = this.activityData[index].longitude
        var latitud2 = this.activityData[index + 1].latitude
        var longuitud2 = this.activityData[index + 1].longitude
        var coordenas1 = {
          latitude: latitud1,
          longitude: longuitud1
        }
        var coordenas2 = {
          latitude: latitud2,
          longitude: longuitud2
        }
        this.acumulador = this.acumulador + haversine(coordenas1,coordenas2)
      }
      
      this.data = [{
        resourceId: this.resourceId,
        metros: this.acumulador
        }];
      this.onResetFromList()
    })
    setTimeout(() => {this.exportExcel()}, 3000)
    
  }

  get recursoSearch(){ return this.searchExportForm.get('recursoSearch')}
  get recursoId(){ return this.searchExportForm.get('recursoId')}
  get desde(){ return this.searchExportForm.get('desde')}
  get hasta(){ return this.searchExportForm.get('hasta')}
}
function resp(resp: any) {
  throw new Error('Function not implemented.');
}

