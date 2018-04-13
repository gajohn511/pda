import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PairedHomeComponent } from "./pair-home.component";
import { BedroomAnalysisComponent } from "./bedroom-analysis/bedroom-analysis.component";
// import { PairWelcomeComponent } from "./pair-welcome/pair-welcome.component";

import { PairRoutingModule } from "./pair-routing.module";

import { MlsService } from "../mls.service";

@NgModule({
  imports: [CommonModule, FormsModule, PairRoutingModule],
  declarations: [
    PairedHomeComponent,
    BedroomAnalysisComponent
    // PairWelcomeComponent
  ],
  providers: [MlsService],
  exports: [
    PairedHomeComponent,
    BedroomAnalysisComponent
    // PairWelcomeComponent
  ]
})
export class PairDashboardModule {}
