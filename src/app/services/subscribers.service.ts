import {Injectable} from '@angular/core';
import {collection, deleteDoc, doc, Firestore, onSnapshot, query} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Subscribers} from "../models/subscribers";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(private fireStore: Firestore, private toastr: ToastrService,) {
  }

  loadData(): Observable<{ id: string; data: Subscribers }[]> {
    const docRef = collection(this.fireStore, 'subscribers');
    return new Observable((observer) => {
      onSnapshot(
        query(docRef),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data() as Subscribers,
          }));
          observer.next(data);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  deleteSubscriber(id: string) {
    const docRef = doc(this.fireStore, 'subscribers', id);
    deleteDoc(docRef)
      .then(() => {
        this.toastr.success('Subscriber deleted successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }

}
