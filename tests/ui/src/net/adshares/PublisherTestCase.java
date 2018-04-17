package net.adshares;

import net.adshares.pages.publisher.*;
import net.adshares.setup.BrowserTestCase;
import org.testng.annotations.Test;

public class PublisherTestCase extends BrowserTestCase {

  private PublisherNewSite publisherNewSite;
  private PublisherMainPage publisherMainPage;
  private SiteAdditionalTargeting siteAdditionalTargeting;
  private SiteCreateAds siteCreateAds;
  private SiteSummary siteSummary;


  @Test
  public void publisherAddNewSite() {
    publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.goToAddNewSite();
    publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.sitePublisherBasicInfo("https://google.pl");
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
    siteAdditionalTargeting.publisherRequiresJsSupport();
    siteAdditionalTargeting.goToCreateAds();
    siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.createAdUnit();
    siteCreateAds.adUnitTemplate();
    siteCreateAds.goToSummary();
    siteSummary = new SiteSummary(driver);
    siteSummary.publishNewSite();
  }

}
