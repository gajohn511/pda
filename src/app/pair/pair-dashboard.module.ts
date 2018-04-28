import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PairedHomeComponent } from "./pair-home.component";
import { BedroomAnalysisComponent } from "./bedroom-analysis/bedroom-analysis.component";
// import { PairWelcomeComponent } from "./pair-welcome/pair-welcome.component";

// import { MyerrorHandler } from "./myerror-handler";
import { PairRoutingModule } from "./pair-routing.module";

import { MlsService } from "../mls.service";
import { BathroomAnalysisComponent } from "./bathroom-analysis/bathroom-analysis.component";

@NgModule({
  imports: [CommonModule, FormsModule, PairRoutingModule],
  declarations: [
    PairedHomeComponent,
    BedroomAnalysisComponent,
    BathroomAnalysisComponent
    // PairWelcomeComponent
  ],
  providers: [
    MlsService
    // {
    //   provide: ErrorHandler,
    //   useClass: MyerrorHandler
    // }
  ],
  exports: [
    PairedHomeComponent,
    BedroomAnalysisComponent
    // PairWelcomeComponent
  ]
})
export class PairDashboardModule {}
