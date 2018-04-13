import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from ".//app-routing.module";
import { PropertyListComponent } from "./property-list/property-list.component";
// import { PairedAnalysisComponent } from './paired-analysis/paired-analysis.component';
// import { BedroomAnalysisComponent } from './bedroom-analysis/bedroom-analysis.component';
import { PairDashboardModule } from "./pair/pair-dashboard.module";

var firebaseConfig = {
  apiKey: "AIzaSyD0-URenit_eNVOu4jYcixlSRiXyA7DyIM",
  authDomain: "k9space-81902.firebaseapp.com",
  databaseURL: "https://k9space-81902.firebaseio.com",
  projectId: "k9space-81902",
  storageBucket: "k9space-81902.appspot.com",
  messagingSenderId: "245447699103"
};

@NgModule({
  declarations: [AppComponent, PropertyListComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    PairDashboardModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
