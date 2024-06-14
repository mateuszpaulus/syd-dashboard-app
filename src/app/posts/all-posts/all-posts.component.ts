import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post';
import { CommonModule, DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css',
})
export class AllPostsComponent implements OnInit, OnDestroy {
  posts: { id: string; data: Post }[] = [];
  private dataCategories: Subscription | null = null;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.dataCategories = this.postsService.loadData().subscribe((data) => {
      this.posts = data;
    });
  }
  convertTimestampToDate(timestamp: Date): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }

    const { seconds, nanoseconds } = timestamp;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }

  deletePost(imageUrl: string, id: string): void {
    this.postsService.deletePost(imageUrl, id);
  }
  onFeatured(id: string, value: boolean): void {
    this.postsService.markFeatured(id, value);
  }

  ngOnDestroy(): void {
    this.dataCategories?.unsubscribe();
  }
}
