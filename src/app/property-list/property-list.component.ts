import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { of } from "rxjs/observable/of";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";

import "../models/mls";
import * as _ from "lodash";

import { MlsService } from "../mls.service";
// import { filter } from "rxjs/operator/filter";
import * as moment from "moment";

interface glaoption {
  text: String;
  value: Number;
}

interface soldin {
  text: string;
  value: number;
}

@Component({
  selector: "app-property-list",
  templateUrl: "./property-list.component.html",
  styleUrls: ["./property-list.component.css"],
  providers: [MlsService]
})
export class PropertyListComponent implements OnInit {
  //
  batchId: number = 0;
  properties: MLS[];

  // GLA parameters
  get GLA(): number {
    let resp: number = 0;
    try {
      resp = parseInt(this.gla, 10);
    } catch (err) {
      // nothing to do
      // response will be zero
    }
    return isNaN(resp) ? 0 : resp;
  }
  gla: string = "";
  glaoptionSelected: number = 0;
  glaoptions: glaoption[] = [
    { text: "None", value: 0 },
    { text: "Within 10%", value: 1 },
    { text: "Within 20%", value: 2 },
    { text: "Within 30%", value: 3 },
    { text: "Within 40%", value: 4 },
    { text: "Within 50%", value: 5 }
  ];

  lot: number = 0;
  lotproximity: number = 0;

  soldin: number = 0;
  soldinOptions: soldin[] = [
    { text: "None", value: 0 },
    { text: "3 Months", value: 3 },
    { text: "6 Months", value: 6 },
    { text: "12 Months", value: 12 },
    { text: "15 Months", value: 15 },
    { text: "18 Months", value: 18 }
  ];

  private batchSearchSubject: Subject<number> = new Subject();

  constructor(private mls: MlsService) {}

  ngOnInit() {
    //
    this.mls.getAllProps().then((resp) => {
      this.properties = resp as MLS[];
    });

    // moment test
    const now = moment();
    console.log(`now: ${now.startOf("day").format("LLL")}`);

    this.batchSearchSubject
      .debounceTime(1000)
      .subscribe((batchidvalue) => {
        this.filterBatchId(batchidvalue);
      });
  }

  batchIdKeyup(batchId: string) {
    this.batchSearchSubject.next(+batchId);
  }

  filterBatchId(batchid: number) {
    this.mls.getAllProps(batchid).then((resp) => {
      this.properties = resp as MLS[];
    });
  }

  // glaKeyup() {
  //   this.glaFilterSubject.next();
  // }

  filterGLA(props: MLS[]): MLS[] {
    debugger;
    let filtered: MLS[];

    if (this.GLA == 0) return props;

    filtered = _.filter(props, (prop) => {
      if (this.glaoptionSelected == 0) {
        return prop.gla == this.GLA;
      } else {
        return (
          prop.gla <=
            this.GLA + this.GLA * (this.glaoptionSelected / 10) &&
          prop.gla >= this.GLA - this.GLA * (this.glaoptionSelected / 10)
        );
      }
    });

    return filtered;
  }

  filterLot(props: MLS[]): MLS[] {
    let filtered: MLS[];

    if (this.lot == 0) return props;

    filtered = _.filter(props, (p) => {
      if (this.lotproximity == 0) {
        return p.site == this.lot;
      } else {
        return (
          p.site <= this.lot + this.lot * (this.lotproximity / 10) &&
          p.site >= this.lot - this.lot * (this.lotproximity / 10)
        );
      }
    });

    return filtered;
  }

  fSoldWithin(props: MLS[]): MLS[] {
    let filtered: MLS[];

    if (this.soldin == 0) return props;

    let badDates = [];
    filtered = _.filter(props, (p) => {
      if (moment(p.closingDate).isValid()) {
        return (
          moment(p.closingDate) >=
          moment()
            .subtract(this.soldin, "M")
            .startOf("day")
        );
      } else {
        badDates.push({
          address: p.address,
          date: p.closingDate.toString()
        });
      }

      // return p.closingDate;
    });

    if (badDates.length) {
      console.log(
        `the following were bad dates found: ${JSON.stringify(badDates)}`
      );
    }

    return filtered;
  }

  get filtered() {
    // debugger;

    // first filter GLA
    let filtered: MLS[] = this.filterGLA(this.properties);

    // site / lot proximity
    filtered = this.filterLot(filtered);

    // Sold within 3/6/12 months
    filtered = this.fSoldWithin(filtered);

    return filtered;
  }

  _keyPress(event: any) {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    debugger;
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}
