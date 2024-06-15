import { Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  StorageReference,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { Post } from '../models/post';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storageFirebase: Storage,
    private fireStore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  uploadImage(
    selectedImage: File | null,
    postData: Post,
    formStatus: string,
    id: string
  ) {
    if (!selectedImage) {
      return;
    }
    const filePath = `postImage/${Date.now()}`;
    const storageRef: StorageReference = ref(this.storageFirebase, filePath);

    uploadBytesResumable(storageRef, selectedImage).then((snapshot) => {
      from(getDownloadURL(snapshot.ref)).subscribe((url) => {
        postData.imageUrl = url;
        if (formStatus === 'Edit') {
          this.updateData(id, postData);
          return;
        }
        this.saveData(postData);
      });
    });
  }

  saveData(postData: Post) {
    const docRef = collection(this.fireStore, 'posts');
    addDoc(docRef, postData)
      .then(() => {
        this.toastr.success('Category added successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
    this.router.navigate(['/posts']);
  }

  loadData(): Observable<{ id: string; data: Post }[]> {
    const docRef = collection(this.fireStore, 'posts');
    return new Observable((observer) => {
      onSnapshot(
        query(docRef),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data() as Post,
          }));
          observer.next(data);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  loadSingleData(id: string): Observable<{ id: string; data: Post }> {
    const docRef = doc(collection(this.fireStore, 'posts'), id);

    return new Observable((observer) => {
      getDoc(docRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = {
              id: docSnapshot.id,
              data: docSnapshot.data() as Post,
            };
            observer.next(data);
          } else {
            observer.error(new Error('Document not found'));
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateData(id: string, postData: Post) {
    const docRef = doc(this.fireStore, 'posts', id);
    const updatedData: Partial<Post> = {
      ...postData,
    };
    updateDoc(docRef, updatedData)
      .then(() => {
        this.toastr.success('Category updated successfully', 'Success');
        this.router.navigate(['/posts']);
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }

  deletePost(imageUrl: string, id: string) {
    const storageRef: StorageReference = ref(this.storageFirebase, imageUrl);

    deleteObject(storageRef)
      .then(() => {
        this.deleteImage(id);
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }

  deleteImage(id: string) {
    const docRef = doc(this.fireStore, 'posts', id);
    deleteDoc(docRef)
      .then(() => {
        this.toastr.success('Post deleted successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }
  markFeatured(id: string, value: boolean) {
    const docRef = doc(this.fireStore, 'posts', id);
    updateDoc(docRef, { isFeatured: value })
      .then(() => {
        this.toastr.success('Post updated successfully', 'Success');
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error');
      });
  }
}
