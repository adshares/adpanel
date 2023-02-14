import { Component, Input, OnInit } from '@angular/core';
import { CampaignClassification } from 'models/campaign.model';
import { faUserCheck, faUserClock, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { bannerClassificationStatusEnum } from 'models/enum/classification.enum';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-classification-info',
  templateUrl: './campaign-classification-info.component.html',
  styleUrls: ['./campaign-classification-info.component.scss'],
})
export class CampaignClassificationInfoComponent implements OnInit {
  @Input() classifications: CampaignClassification[];
  @Input() extended: boolean = false;
  options: TargetingOption[];
  private _keywordsObj = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.options = this.route.snapshot.data.filteringOptions;
  }

  isInProgress(classification: CampaignClassification) {
    return (
      classification.status === bannerClassificationStatusEnum.NEW ||
      classification.status === bannerClassificationStatusEnum.IN_PROGRESS
    );
  }

  isError(classification: CampaignClassification) {
    return (
      classification.status === bannerClassificationStatusEnum.ERROR ||
      classification.status === bannerClassificationStatusEnum.FAILURE
    );
  }

  isSuccess(classification: CampaignClassification) {
    return classification.status === bannerClassificationStatusEnum.SUCCESS;
  }

  status(classification: CampaignClassification): string {
    if (this.isError(classification)) {
      return 'Classification error';
    }
    if (this.isSuccess(classification)) {
      return 'Classified';
    }
    if (this.isInProgress(classification)) {
      return 'Classification in progress';
    }
  }

  className(classification: CampaignClassification): string {
    const prefix = 'campaign-classification-info__';
    if (this.isError(classification)) {
      return prefix + 'error';
    }
    if (this.isSuccess(classification)) {
      return prefix + 'success';
    }
    if (this.isInProgress(classification)) {
      return prefix + 'in-progress';
    }
  }

  icon(classification: CampaignClassification): IconDefinition {
    if (this.isError(classification)) {
      return faUserTimes;
    }
    if (this.isSuccess(classification)) {
      return faUserCheck;
    }
    return faUserClock;
  }

  description(classification: CampaignClassification): string {
    let descriptions = [];

    if (this.isInProgress(classification)) {
      descriptions.push('The campaign is awaiting classification; some of the ads may not display until then.');
    } else if (this.isSuccess(classification)) {
      descriptions.push('The campaign has been successfully classified.');
    } else {
      descriptions.push(
        'An unknown error has occurred. Some of the ads may not display correctly. Please contact support.'
      );
    }

    if (!this.extended) {
      const keywords = this.keywords(classification).map(category => {
        return category.label;
      });
      if (keywords.length > 0) {
        const prefix = this.isInProgress(classification) ? 'Current categories' : 'Categories';
        descriptions.push(`${prefix}: ${keywords.join(', ')}`);
      }
    }

    return descriptions.join(' ');
  }

  keywords(classification: CampaignClassification, group: string = 'category'): TargetingOptionValue[] {
    if ('undefined' === typeof this._keywordsObj[classification.classifier]) {
      this._keywordsObj[classification.classifier] = {};
    }
    if ('undefined' === typeof this._keywordsObj[classification.classifier][group]) {
      let keywords = [];
      if ('undefined' !== typeof classification.keywords[group]) {
        keywords = classification.keywords[group].map((keyword: string) => {
          const option = this.options.find(
            (option: TargetingOption) => option.key === `${classification.classifier}:${group}`
          );
          const value = option ? option.values.find(item => item.value === keyword) : null;
          return value ? value : { value: keyword, label: keyword };
        });
      }
      this._keywordsObj[classification.classifier][group] = keywords;
    }
    return this._keywordsObj[classification.classifier][group];
  }
}
