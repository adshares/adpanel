package pl.adshares.adpanel;

import org.openqa.selenium.support.ui.WebDriverWait;
import pl.adshares.adpanel.pages.publisher.*;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;

public class PublisherTestCase extends BrowserTestCase {

  @Test
  public void publisherAddNewSite() throws InterruptedException {
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

  @Test
  public void publisherAddNewSite_down() throws InterruptedException {
    PublisherMainPage publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.goToAddNewSite_down();
    PublisherNewSite publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.sitePublisherBasicInfo("https://www.wp.pl");
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

  @Test
  public void publiserEditSiteActive() throws InterruptedException {
    PublisherMainPage publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.goToEditSiteActive();
    PublisherEditSite publisherEditSite = new PublisherEditSite(driver);
    publisherEditSite.sitePublisherBasicInfo("https://www.onet.pl");
    SiteAdditionalTargeting siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
    siteAdditionalTargeting.publisherRequiresJsSupport();
    siteAdditionalTargeting.goToCreateAds();
    SiteCreateAds siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.editAdUnit();
    siteCreateAds.adUnitTemplate();
    siteCreateAds.goToSummary();
    SiteSummary siteSummary = new SiteSummary(driver);
    siteSummary.publishNewSite();
    //Thread.sleep(12000);
  }

  @Test
  public void publiserEditSiteEdit() throws InterruptedException {
    PublisherMainPage publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.goToEditSiteActive();
    PublisherEditSite publisherEditSite = new PublisherEditSite(driver);
    publisherEditSite.sitePublisherBasicInfo("https://www.o2.pl");
  }


}
