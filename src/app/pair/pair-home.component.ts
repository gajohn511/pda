import { Component, OnInit } from "@angular/core";

// import "../models/mls";
import { MlsService } from "../mls.service";
import * as moment from "moment";
import * as _ from "lodash";
import { isNull, isNullOrUndefined } from "util";

@Component({
  // selector: "app-paired-analysis",
  //   templateUrl: "./paired-analysis.component.html",
  //   styleUrls: ["./paired-analysis.component.css"]
  // providers: [MlsService]

  template: `
  <h3 style="margin-bottom: 30px;">> Paired Data Analysis</h3>
<form class="container" style="border-bottom: 1px solid blue; margin-bottom: 20px">
  <div class="form-group row">
    <label class="col-sm-1 col-form-label" >nBatchID</label>
    <div class="col-sm-2">
        <input type="text" name="batch" width="20px" placeholder="enter a batchid" 
        #bid [(ngModel)]="batchid" (keypress)="_keyPress($event)" class="form-control" />
        <small id="emailHelp" class="form-text text-muted" style="padding-left: 5px;"> we have {{ _properties }} properties </small>
    </div>

    <div class="col-sm-3" >    
      <div class="btn-group btn-group-toggle" >
          <label class="btn btn-secondary" [ngClass]="active(1)" >
            <input type="radio" name="options" id="option1" autocomplete="off" value="1" [(ngModel)]="option" > Bedroom
          </label>
          <label class="btn btn-secondary" [ngClass]="active(2)" >
            <input type="radio" name="options" id="option2" autocomplete="off" value="2" [(ngModel)]="option"> Bathroom
          </label>
          <label class="btn btn-secondary" [ngClass]="active(3)" >
            <input type="radio" name="options" id="option3" autocomplete="off" value="3" [(ngModel)]="option"> GLA
          </label>
      </div> <!-- btn-group -->
    </div> 

    <!--
    <div class="col-sm-2">
    option: {{ option }}
    </div> 
    -->
  
  </div>

  <!--
  <div class="form-group" style="margin-bottom:25px;border-bottom: 1px solid blue;">
    <p>
      <label for="">nBatchID:</label>
      <br>
      <input type="text" name="batch" width="20px" placeholder="enter a batchid" 
      #bid [(ngModel)]="batchid" (keypress)="_keyPress($event)" />      
      <small id="emailHelp" class="form-text text-muted"> we have {{ _properties }} properties </small>
    </p>
  </div> -->
  <!-- <div *ngIf="(properties)?.length">we have {{ properties.length }} properties </div> -->

</form>

<app-bedroom-analysis *ngIf="displayView(1)" [properties]="properties" ></app-bedroom-analysis>
<app-bathroom-analysis *ngIf="displayView(2)" [properties]="properties" ></app-bathroom-analysis>

<!-- <router-outlet></router-outlet> -->
`,
  styles: [".btn-secondary.active { color: #f0ad4e !important; }"]
})
export class PairedHomeComponent implements OnInit {
  // >
  // component variables and properties
  // ********************************** >

  properties: MLS[];

  get _properties(): number {
    return isNullOrUndefined(this.properties) ? 0 : this.properties.length;
  }

  batchid: number = 0;

  bedroomfrom: number = 0;
  bedroomto: number = 0;

  option: number;

  // end of variable and properties
  // >

  constructor(private mls: MlsService) {}
  // constructor() {}

  ngOnInit() {
    //
    // if (this.batchid > 0) {
    //   this.mls.getAllProps(this.batchid).then((resp) => {
    //     this.properties = resp as MLS[];
    //   });
    // }
  }

  getprops = function() {
    this.mls.getAllProps(this.batchid).then((resp) => {
      this.properties = resp as MLS[];
    });
  };

  private initProps = _.debounce(this.getprops, 1000);
  _keyPress(event: any) {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.stopPropagation();
      event.returnValue = false;
      event.cancelBubble = true;
      event.preventDefault();
      return false;
    } else {
      this.initProps();
    }
  }

  displayView(option: number) {
    return +this.option === option;
  }

  active(opt: number): string {
    return opt === +this.option ? "active" : "";
  }
}
