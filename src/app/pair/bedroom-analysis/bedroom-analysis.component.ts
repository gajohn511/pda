import { Component, OnInit, Input } from "@angular/core";
import { isNull, isNullOrUndefined } from "util";

import * as _ from "lodash";
import { Promise } from "q";
import { MlsService } from "../../mls.service";
// import { filter } from "rxjs/operator/filter";

interface flist {
  glaOption: number;
  list: MLS[];
  prop?: MLS;
  fbath?: boolean;
  sqftlist?: sqft[];
  // stat(property: MLS): boolean;
}

interface sqft {
  pricePer: number;
  propertyOne: string;
  propertyTwo: string;
  salePriceOne: number;
  salePriceTwo: number;
  lgaOne: number;
  lgaTwo: number;
  glaoption: number;
  propA: MLS;
  propB: MLS;
}

interface glaoption {
  text: string;
  value: number;
}

@Component({
  selector: "app-bedroom-analysis",
  templateUrl: "./bedroom-analysis.component.html",
  styleUrls: ["./bedroom-analysis.component.css"]
})
export class BedroomAnalysisComponent implements OnInit {
  //
  // properties >

  @Input() properties: MLS[];

  bedroomfrom: number = 0;
  bedroomto: number = 0;
  consoleMsg: string = "";

  flattenList: sqft[] = [];
  median: number = 0;

  glaoptions: glaoption[] = [
    { text: "10%", value: 10 },
    { text: "15%", value: 15 },
    { text: "20%", value: 20 },
    { text: "25%", value: 25 },
    { text: "30%", value: 30 }
  ];
  gla: number = 10;
  // end of properties >

  constructor(private mls: MlsService) {}

  ngOnInit() {}

  filterNumbers(event: any) {
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

  analyize() {
    // debugger;

    if (!this.properties.length) {
      this.consoleMsg = "no properties to filter through";
      return false;
    }

    if (this.bedroomfrom === this.bedroomto) {
      this.consoleMsg =
        "bedrooms criteria needs to be different from one another";
      return false;
    }

    const filtered = _.filter(
      this.properties,
      (x) => x.beds >= +this.bedroomfrom && x.beds <= +this.bedroomto
      // (x) => x.beds === +this.bedroomfrom
    );

    if (!filtered.length) {
      this.consoleMsg = "Results were empty";
      return false;
    }

    let aFiltered = _.filter(
      filtered,
      (x) => x.beds === +this.bedroomfrom
    );

    let bFiltered = _.filter(filtered, (x) => x.beds === +this.bedroomto);

    if (!aFiltered.length || !bFiltered.length) {
      this.consoleMsg = "error; empty results from either from/to";
      return false;
    }

    // begin logic+

    let filteredList: flist[] = [];
    for (let prop of aFiltered) {
      // debugger;

      // Filter through GLA
      this.filterGla([10, 15, 20, 25, 30], bFiltered, prop, filteredList);

      // skip over if this property is empty in gla matching results
      if (!this.listStat(filteredList, prop)) {
        continue;
      }

      // filter full baths
      this.filterFullBath(prop, filteredList);

      // skip over if this property if empty results
      if (!this.listStat(filteredList, prop)) {
        continue;
      }

      // filter half baths
      this.filterHalfBath(prop, filteredList);
    }

    // final stage: Price / sqft - calculations
    this.calculateBedroomPrice(filteredList);

    this.flattenList = _.flattenDeep(
      _.map(
        _.filter(filteredList, (x) => x.list.length),
        (x) => x.sqftlist
      )
    ) as sqft[];

    // this.flattenList = _.filter(this.flattenList, (x) => {
    //   return x.pricePer >= 10 && x.pricePer <= 80;
    // });

    // filter and narrow results
    this.flattenList = _.filter(
      this.flattenList,
      (e) => e.pricePer > 0 && e.pricePer < 11000
    );

    // apply sort by price
    if (this.flattenList.length) {
      this.flattenList = _.sortBy(this.flattenList, (e) => e.pricePer);
    }

    // calculate median
    this.calculateMedian(this.flattenList);

    debugger;
  }

  get getMedian() {
    return this.median.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, "$1,");
  }

  get getList() {
    const here = true;
    const list = _.filter(
      this.flattenList,
      (e) =>
        e.glaoption === +this.gla && (e.pricePer > 0 && e.pricePer < 11000)
    );
    return list;
  }

  calculateMedian(list: sqft[]) {
    if (list.length > 2) {
      const priceArray = this.flattenList.map((x) => x.pricePer).sort();

      if (priceArray.length % 2 === 0) {
        // its even
        const multiplier = priceArray.length / 2;
        const bottom = priceArray[multiplier];
        const top = priceArray[multiplier + 1];
        this.median = Math.abs(bottom + top / 2);
      } else {
        // its odd
      }
    }
  }

  calculateBedroomPrice(list: flist[]) {
    for (let option of _.filter(list, (opt) => opt.list.length)) {
      option.sqftlist = []; // instantiate a new list
      const propA = option.prop;

      for (let propB of option.list) {
        const sqft: sqft = {
          pricePer: 0,
          propertyOne: "",
          propertyTwo: "",
          salePriceOne: 0,
          salePriceTwo: 0,
          lgaOne: 0,
          lgaTwo: 0,
          glaoption: option.glaOption,
          propA,
          propB
        };

        // property A
        sqft.propertyOne = propA.address;
        sqft.salePriceOne = propA.salePrice;
        sqft.lgaOne = propA.gla;

        // property B
        sqft.propertyTwo = propB.address;
        sqft.salePriceTwo = propB.salePrice;
        sqft.lgaTwo = propB.gla;

        sqft.pricePer = Math.abs(sqft.salePriceOne - sqft.salePriceTwo);

        option.sqftlist.push(sqft);
      }
    }
  }

  calculateSQFT(list: flist[]) {
    for (let option of _.filter(list, (opt) => opt.list.length)) {
      option.sqftlist = []; // instantiate a new list
      const propA = option.prop;

      for (let propB of option.list) {
        const sqft: sqft = {
          pricePer: 0,
          propertyOne: "",
          propertyTwo: "",
          salePriceOne: 0,
          salePriceTwo: 0,
          lgaOne: 0,
          lgaTwo: 0,
          glaoption: option.glaOption,
          propA,
          propB
        };

        // property A
        sqft.propertyOne = propA.address;
        sqft.salePriceOne = propA.salePrice;
        sqft.lgaOne = propA.gla;

        // property B
        sqft.propertyTwo = propB.address;
        sqft.salePriceTwo = propB.salePrice;
        sqft.lgaTwo = propB.gla;

        const diffPrice = Math.abs(sqft.salePriceOne - sqft.salePriceTwo);
        const diffSqft = Math.abs(sqft.lgaOne - sqft.lgaTwo);

        sqft.pricePer = diffPrice / diffSqft;
        option.sqftlist.push(sqft);
      }
    }
  }

  filterHalfBath(prop: MLS, list: flist[]) {
    let obj = _.find(list, (e) => e.prop === prop);
    obj.list = _.filter(obj.list, (f) => f.hbaths === prop.hbaths);
  }

  filterFullBath(prop: MLS, out: flist[]) {
    let obj = _.find(out, (e) => {
      return e.prop === prop;
    });

    let flist = _.filter(obj.list, (f) => {
      return f.fbaths === prop.fbaths;
    });

    obj.list = flist;
    obj.fbath = flist.length > 0;
  }

  filterGla(options: number[], blist: MLS[], prop: MLS, out: flist[]) {
    let cnt = 0;
    for (let i = 0; i < options.length; i++) {
      let resp: MLS[] = [];

      this.parseGla(options[i], blist, prop.gla, (list) => {
        resp = list;
      });

      if (resp.length > 0) {
        cnt++;
        out.push({
          glaOption: options[i],
          list: resp,
          prop
        });
        break;
      }

      if (i === options.length - 1) {
        // push an empty flist object since
        // it didnt find any results for GLA
        if (cnt === 0) {
          out.push({
            glaOption: 0,
            list: [],
            prop
          });
        }
      }
    }
  }

  parseGla(
    option,
    tolist: MLS[],
    gla: number,
    callback: (outlist: MLS[]) => void
  ) {
    // return Promise((resolve, reject) => {
    const base = gla - gla * (option / 100);
    const top = gla + gla * (option / 100);

    var fList = _.filter(tolist, (prop) => {
      return prop.gla >= base && prop.gla <= top;
    });

    callback(fList);
    // if (fList.length) {
    //   resolve(fList);
    // } else {
    //   reject("");
    // }
    // });
  }

  listStat(list: flist[], prop: MLS): boolean {
    if (!_.find(list, (e) => e.prop === prop).list.length) {
      return false;
    }

    return true;
  }

  testme() {
    let x = this.mls.num;
    debugger;
  }

  //
}
