import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { of } from "rxjs/observable/of";

// local imports
import "./models/mls";
import * as _ from "lodash";
import { Promise } from "q";

@Injectable()
export class MlsService {
  private propertiesCollection: AngularFirestoreCollection<MLS>;
  properties: Observable<MLS[]>;
  property: Observable<MLS>;
  numero: number = 0;

  constructor(private afs: AngularFirestore) {
    this.propertiesCollection = this.afs.collection<MLS>("mls");
    this.properties = this.propertiesCollection.valueChanges();
  }

  get num() {
    return this.numero;
  }

  getAllProps(batchid: number = 0) {
    return Promise((resolve, reject) => {
      this.numero = batchid;
      this.propertiesCollection.ref
        .get()
        .then((snapshot) => {
          // return snapshot.docs.map((doc) => doc.data() as MLS);
          // this.isize = snapshot.size;
          // debugger;
          let data: MLS[] = snapshot.docs.map((doc) => doc.data() as MLS);
          data = _.filter(data, (p) => {
            if (batchid == 0) {
              return true;
            } else {
              return p.batchid == batchid;
            }
          });

          return resolve(data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}
