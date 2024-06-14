import { Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private fireStore: Firestore, private toastr: ToastrService) {}

  saveData(data: Category) {
    const docRef = collection(this.fireStore, 'categories');

    addDoc(docRef, data)
      .then((docRef) => {
        this.toastr.success('Category added successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }

  loadData(): Observable<{ id: string; data: { category: string } }[]> {
    const docRef = collection(this.fireStore, 'categories');
    return new Observable((observer) => {
      onSnapshot(
        query(docRef),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: { category: doc.data()['category'] },
          }));
          observer.next(data);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  updateData(id: string, editData: { category: string }) {
    const docRef = doc(this.fireStore, 'categories', id);
    updateDoc(docRef, editData)
      .then(() => {
        this.toastr.success('Category updated successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }

  deleteData(id: string) {
    const docRef = doc(this.fireStore, 'categories', id);
    deleteDoc(docRef)
      .then(() => {
        this.toastr.success('Category updated successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }
}
