import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PropertyListComponent } from "./property-list/property-list.component";
// import { PairedAnalysisComponent } from "./pair/paired-analysis.component";

const routes: Routes = [
  { path: "list", component: PropertyListComponent }
  // { path: "pair", component: PairedAnalysisComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
