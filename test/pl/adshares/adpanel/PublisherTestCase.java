package pl.adshares.adpanel;

import org.openqa.selenium.support.ui.WebDriverWait;
import pl.adshares.adpanel.pages.publisher.*;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;
import pl.adshares.adpanel.tools.RandomPage;

public class PublisherTestCase extends BrowserTestCase {

//  TC 9
  @Test
  public void AddSummary() throws InterruptedException {
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
    siteCreateAds.adUnitTemplate("Test advertisement");
    siteCreateAds.goToSummary();
    SiteSummary siteSummary = new SiteSummary(driver);
    siteSummary.publishNewSite();
  }
//  TC 10
  @Test
  public void AddSummary_down() throws InterruptedException {
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
    siteCreateAds.adUnitTemplate("Test advertisement");
    siteCreateAds.goToSummary();
    SiteSummary siteSummary = new SiteSummary(driver);
    siteSummary.publishNewSite();
  }
  //  TC 11
  @Test
  public void SaveAsDraft() throws InterruptedException {
    PublisherMainPage publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.goToAddNewSite();
    PublisherNewSite publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.sitePublisherBasicInfo("https://www.google.pl");
    SiteAdditionalTargeting siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
    siteAdditionalTargeting.publisherRequiresJsSupport();
//    6. Additional Targeting - SaveAsDraft
    siteAdditionalTargeting.saveAsDraft();
    publisherMainPage.goToAddNewSite();
    publisherNewSite.goToSiteAdditionalTargeting();
    siteAdditionalTargeting.goToCreateAds();
    SiteCreateAds siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.createAdUnit();
    // TODO: 25.07.18 nie działa Save as Draft dla Creast Ad Units - Tomek
    System.out.println("4");
    siteCreateAds.adUnitTemplate("Test advertisement");
    System.out.println("5");
    siteCreateAds.goToSummary();
    System.out.println("6");
    SiteSummary siteSummary = new SiteSummary(driver);
    System.out.println("7");
    siteSummary.publishNewSite();
  }
  //  TC 12
  @Test
  public void Back() throws InterruptedException {
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
    siteCreateAds.adUnitTemplate("Test advertisement");
    siteCreateAds.goToSummary();
    SiteSummary siteSummary = new SiteSummary(driver);
    siteSummary.back();
    siteCreateAds.back();
    siteAdditionalTargeting.back();
    publisherNewSite.backToDashboard();
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
    siteCreateAds.adUnitTemplate("Test advertisement");
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
