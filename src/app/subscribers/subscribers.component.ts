import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SubscribersService} from "../services/subscribers.service";
import {Subscribers} from "../models/subscribers";

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.css'
})
export class SubscribersComponent implements OnInit {
  subscribers: { id: string; data: Subscribers }[] = [];

  constructor(private subscribersService: SubscribersService) {
  }

  ngOnInit(): void {
    this.subscribersService.loadData().subscribe((data) => {
      this.subscribers = data
    })
  }

  deleteSubscriber(id: string): void {
    this.subscribersService.deleteSubscriber(id);
  }
}
