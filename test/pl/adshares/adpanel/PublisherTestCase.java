package pl.adshares.adpanel;

import pl.adshares.adpanel.pages.publisher.*;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;

public class PublisherTestCase extends BrowserTestCase {

  @Test
  public void publisherAddNewSite() {
    PublisherMainPage publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.goToAddNewSite();
    PublisherNewSite publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.sitePublisherBasicInfo("https://www.google.pl");
    SiteAdditionalTargeting siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
    siteAdditionalTargeting.publisherRequiresJsSupport();
    siteAdditionalTargeting.goToCreateAds();
    SiteCreateAds siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.createAdUnit();
    siteCreateAds.adUnitTemplate();
    siteCreateAds.goToSummary();
    SiteSummary siteSummary = new SiteSummary(driver);
    siteSummary.publishNewSite();
  }

}
