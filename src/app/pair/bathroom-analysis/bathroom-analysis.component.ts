import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { isNull, isNullOrUndefined, error } from "util";
import * as _ from "lodash";

import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { fromEvent } from "rxjs/observable/fromEvent";
// import { ajax } from 'rxjs/observable/dom/ajax';

import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  concat as concatu,
  mapTo,
  tap
  // interval
} from "rxjs/operators";

// import { debounce } from "rxjs/operators/debounce";
import { of } from "rxjs/observable/of";
import { interval } from "rxjs/observable/interval";
import { concat } from "rxjs/observable/concat";
import { timer } from "rxjs/observable/timer";

import "rxjs/add/observable/of";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";
// import "rxjs/add/operator/debounceTime";
// import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/concat";
import "rxjs/add/operator/take";
import "rxjs/add/operator/merge";

// import * as tim from "timers";
// import {  } from "rxjs/Observable/

interface filteredList {
  // glaOption: number;
  list?: MLS[];
  prop?: MLS;
  // fbath?: boolean;
  // sqftlist?: sqft[];
  // stat(property: MLS): boolean;
}

interface sqft {
  pricePer: number;
  propertyOne: string;
  propertyTwo: string;
  salePriceOne: number;
  salePriceTwo: number;
  glaOne: number;
  glaTwo: number;
  glaoption: number;
  propA: MLS;
  propB: MLS;
  // pairs?: sqft[];
}

interface pairs {
  Prop: MLS;
  Pairs?: pair[];
  Median?: number;
}

interface pair {
  SalePrice: number;
  Address: string;
  Gla: number;
  RegressionPrice: number;
}

interface optionDash {
  type: OptionType;
  value: any;
}

export enum OptionType {
  gla = 1,
  other = 2
}

@Component({
  selector: "app-bathroom-analysis",
  templateUrl: "./bathroom-analysis.component.html",
  styleUrls: ["./bathroom-analysis.component.css"]
})
export class BathroomAnalysisComponent implements OnInit, OnDestroy {
  constructor() {
    // if (!this.properties) {
    //   this.properties = [];
    // }
  }

  ngOnDestroy() {
    this.subscription1$.unsubscribe();
    console.log("goodbye");
  }

  ngOnInit() {
    // BathA search
    const searchBox = document.getElementById("batha");
    const observSearch$ = fromEvent(searchBox, "input").pipe(
      map((e: KeyboardEvent) => +(e.target as HTMLInputElement).value),
      filter((val) => val > 0),
      distinctUntilChanged(),
      tap((val) => (this.bathb = val + 1)),
      debounceTime(10),
      switchMap((_) => this.generateList())
    );

    this.subscription1$ = observSearch$
      // .merge(observGLA$)
      .subscribe((list) => {
        console.log("finished");
        this.list = of(list);
      });

    // gla Subject Change
    // const observGLA$ = this.glaSubject.pipe(
    //   debounceTime(10),
    //   switchMap((gla) => {
    //     console.log("observeGLA");
    //     this.gla = +gla;
    //     return this.generateList();
    //   })
    // );

    // options Observer

    const option$ = this.optSubject.pipe(
      tap((val) => this.optionChk(val)),
      debounceTime(1000),
      switchMap((_) => this.generateList())
    );

    this.optionsSubs = option$.subscribe((list) => (this.list = of(list)));

    //

    // let first = Observable.create((o) => {
    //   // o.next("hello");
    //   // o.next("world");
    //   setTimeout(function(o) {
    //     o.next(1);
    //   }, 5000),
    //     (err) => {},
    //     () => {};
    // });

    // let second = Observable.create((o) => {
    //   setTimeout(() => {
    //     o.next(2);
    //   }, 6000),
    //     (err) => {},
    //     () => {};
    // });

    // second attempt ------------------>

    // let first = interval(1000).take(3);

    // let second = interval(1500).take(3);

    // // first.
    // // let result = first.concat(second);
    // let result = concat(first, second);

    // result.subscribe((val) => console.log(val));

    // third attempt --------------------->

    // Observable.of(1, 2, 3)
    //   .map((x) => x + "!!!")
    //   .subscribe((o) => console.log(o));

    // fourth attempt: ---------------------->

    // let first = timer(5000, 100)
    //   .map((r) => {
    //     return { source: 1, value: r };
    //   })
    //   .take(4);

    // let second = timer(500)
    //   .map((r) => {
    //     return { source: 2, value: r };
    //   })
    //   .take(4);

    // this.subscription1$ = first
    //   .merge(second)
    //   .subscribe((res) => console.log(JSON.stringify(res)));

    // fifth attempt: ---------------------------->
    // const source = timer(0, 5000);
    // //switch to new inner observable when source emits, invoke project function and emit values
    // const example = source
    //   .pipe(
    //     switchMap(
    //       (_) => interval(2000),
    //       (outerValue, innerValue, outerIndex, innerIndex) => ({
    //         outerValue,
    //         innerValue,
    //         outerIndex,
    //         innerIndex
    //       })
    //     )
    //   )
    //   .take(5);
    // const subscribe = example.subscribe((val) => console.log(val));

    // end
  }

  // properties >
  @Input() properties: MLS[];

  list: Observable<pairs[]>;

  consoleMsg: string = "";
  batha: number;
  bathb: number;

  bathType: string = "fbaths";
  bathOptions: {} = [
    { text: "Full", value: "fbaths" },
    { text: "Half", value: "hbaths" }
  ];

  glaoptions: {}[] = [
    { text: "10%", value: 10 },
    { text: "15%", value: 15 },
    { text: "20%", value: 20 },
    { text: "25%", value: 25 },
    { text: "30%", value: 30 }
  ];
  gla: number = 10;

  // private glaSubject: Subject<number> = new Subject();
  private optSubject: Subject<optionDash> = new Subject();

  subscription1$: Subscription;
  optionsSubs: Subscription;

  // getters

  get listA(): MLS[] {
    let a = _.filter(
      this.properties,
      (x) => x[this.bathType] === +this.batha
    );
    return a;
  }

  get listB(): MLS[] {
    return _.filter(
      this.properties,
      (x) => x[this.bathType] === +this.bathb
    );
  }

  // ->

  _keypressNumbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.stopPropagation();
      event.returnValue = false;
      event.cancelBubble = true;
      event.preventDefault();
      return false;
    }

    // debugger;
    // if (event.currentTarget.name === "batha") {
    //   this.bathb = +(event.currentTarget.value + inputChar) + 1;
    // }
  }

  validateBedButton(): boolean {
    if (isNullOrUndefined(this.properties)) {
      return false;
    }

    if (this.properties.length == 0) {
      return false;
    }

    return true;
  }

  // TODO:
  beginProcess() {
    const flist: filteredList[] = [];
    this.processAnalysis(flist);
  }

  processAnalysis(out: filteredList[] = []) {
    // debugger;
    if (!this.validateProcess) {
      return false;
    }

    // const outList: filteredList[] = [];
    for (let prop of this.listA) {
      // debugger;

      out.push({ prop, list: this.listB });

      if (!this.filterBedrooms(prop, out)) {
        // this.CONTINUE(prop);
        continue;
      }
    }

    return true;
  }

  get validateProcess(): boolean {
    this.consoleMsg = "";

    if (!this.properties.length) {
      this.consoleMsg = "no properties to filter through";
      return false;
    }

    if (+this.batha === +this.bathb) {
      this.consoleMsg =
        "bathroom criteria needs to be different from one another";
      return false;
    }

    if (
      _.filter(
        this.properties,
        (x) =>
          x[this.bathType] >= +this.batha &&
          x[this.bathType] <= +this.bathb
      ).length <= 0
    ) {
      this.consoleMsg = "results were empty";
      // throw new error("results were empty 2");
      return false;
    }

    if (
      _.filter(this.properties, (x) => x[this.bathType] === +this.batha)
        .length === 0
    ) {
      this.consoleMsg = `results were empty for ${this.batha} bathrooms`;
      return false;
    }

    if (
      _.filter(this.properties, (x) => x[this.bathType] === +this.bathb)
        .length === 0
    ) {
      this.consoleMsg = `results were empty for ${this.bathb} bathrooms`;
      return false;
    }
    // debugger;
    return true;
  }

  filterBedrooms(prop: MLS, outlist: filteredList[]): boolean {
    const obj = this.FIND(prop, outlist);

    obj.list = _.filter(obj.list, (x) => x.beds === prop.beds);

    if (!obj.list.length) {
      return false;
    }

    return true;
  }

  filterGLA(prop: MLS, outlist: filteredList[]): boolean {
    //

    return true;
  }

  generateList() {
    let slist: pairs[] = [];

    if (!this.IsAnyProperties) {
      return of(slist);
    }

    let flist: filteredList[] = [];
    if (!this.processAnalysis(flist)) {
      this.consoleMsg = "Error occured";
      return of(slist);
    }

    slist = this.refactor(flist);
    return of(slist);
    // var here = true;
  }

  optionChk(opt: optionDash): void {
    switch (opt.type) {
      case OptionType.gla:
        this.gla = +opt.value;
        break;
      case OptionType.other:
        //TODO
        break;
      default:
        //TODO
        break;
    }
  }

  // utilities >

  FIND(prop: MLS, list: filteredList[]) {
    return _.find(list, (e) => e.prop === prop);
  }

  CONTINUE(prop: MLS) {
    console.log(
      `skipping prop: ${prop.address}, bedroom match ${prop.beds}`
    );
  }

  // interface pairs {
  //   Prop: MLS;
  //   Pairs?: pair[];
  //   Median?: number;
  // }

  // interface pair {
  //   SalePrice: number;
  //   Address: string;
  //   Gla: number;
  //   RegressionPrice: number;
  // }

  refactor(list: filteredList[]): pairs[] {
    const refactored: pairs[] = [];

    for (let item of _.filter(list, (e) => e.list.length)) {
      const thisPairs: pairs = {
        Prop: item.prop,
        Pairs: [],
        Median: 0
      };

      for (let p of item.list) {
        const thisPair: pair = {
          SalePrice: p.salePrice,
          Address: p.address,
          Gla: p.gla,
          RegressionPrice: Math.abs(item.prop.salePrice - p.salePrice)
        };

        thisPairs.Pairs.push(thisPair);
      }

      // Median
      thisPairs.Median = this.getMedian(
        _.map(thisPairs.Pairs, (e) => e.RegressionPrice)
      );
      refactored.push(thisPairs);
    }

    //// list = _.filter(list, (e) => e.list.length);
    // for (let item of _.filter(list, (e) => e.list.length)) {
    //   const propA = item.prop;

    //   for (let propB of item.list) {
    //     const sqft: sqft = {
    //       pricePer: 0,
    //       propertyOne: "",
    //       propertyTwo: "",
    //       salePriceOne: 0,
    //       salePriceTwo: 0,
    //       glaOne: 0,
    //       glaTwo: 0,
    //       glaoption: 0,
    //       propA,
    //       propB
    //     };

    //     // property A
    //     sqft.propertyOne = propA.address;
    //     sqft.salePriceOne = propA.salePrice;
    //     sqft.glaOne = propA.gla;

    //     // property B
    //     sqft.propertyTwo = propB.address;
    //     sqft.salePriceTwo = propB.salePrice;
    //     sqft.glaTwo = propB.gla;

    //     sqft.pricePer = Math.abs(sqft.salePriceOne - sqft.salePriceTwo);
    //     dlist.push(sqft);
    //   }
    // }

    return refactored;
  }

  getMedian(list: number[]): number {
    if (!list.length) {
      return 0;
    }

    const sorted = list.sort();
    let middle = Math.floor(sorted.length / 2);
    let isEven = sorted.length % 2 === 0;
    return isEven
      ? (sorted[middle] + sorted[middle - 1]) / 2
      : sorted[middle];
  }

  // COMPONENT UTILITES

  IsGlaOptionActive(arg: number): string {
    return arg === +this.gla ? "active" : "";
  }

  get IsAnyProperties(): boolean {
    if (isNullOrUndefined(this.properties)) {
      return false;
    }

    if (this.properties.length == 0) {
      return false;
    }

    return this.properties.length > 0 && +this.bathb > 0;
  }

  public options: any = Object.assign({}, OptionType);
  myOption(option: number, value: any): void {
    this.optSubject.next({ type: option, value });
  }

  // ->
}
