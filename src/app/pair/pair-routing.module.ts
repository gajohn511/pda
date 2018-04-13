import { NgModule } from "@angular/core";
// import { CommonModule } from "@angular/common";

import { RouterModule, Routes } from "@angular/router";

import { PairedHomeComponent } from "./pair-home.component";
import { BedroomAnalysisComponent } from "./bedroom-analysis/bedroom-analysis.component";
import { PairWelcomeComponent } from "./pair-welcome/pair-welcome.component";

const pairRoutes: Routes = [
  {
    path: "pair",
    component: PairedHomeComponent
    // children: [
    //   { path: "", component: PairWelcomeComponent },
    //   { path: "bed", component: BedroomAnalysisComponent }
    // ]
  }
  // { path: "pair/bed", component: BedroomAnalysisComponent }
];

@NgModule({
  imports: [RouterModule.forChild(pairRoutes)],
  exports: [RouterModule]
  // declarations: []
})
export class PairRoutingModule {}
