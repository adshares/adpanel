import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PublisherService} from 'publisher/publisher.service';
import {Site} from 'models/site.model';


@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.component.html',
  styleUrls: ['./classifier.component.scss']
})
export class ClassifierComponent implements OnInit {
  site: Site|undefined;
  isGlobal: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.site = this.route.snapshot.data.site;
    this.isGlobal = this.site === undefined;
  }

  onStepBack() {
    this.isGlobal ? this.router.navigate(['/publisher', 'dashboard']) :
      this.router.navigate(['/publisher', 'site', this.site.id]);
  }
}
