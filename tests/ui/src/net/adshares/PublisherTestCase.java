package net.adshares;

import net.adshares.pages.DashboardPopup;
import net.adshares.pages.LoginPage;
import net.adshares.pages.publisher.*;
import net.adshares.setup.BrowserTestCase;
import org.testng.annotations.Test;

public class PublisherTestCase extends BrowserTestCase {

  @Test(priority = 1)
  public void loginTest() {
    loginPage = new LoginPage(driver);
    loginPage.loginSignIn(loginAdService, passwordAdService);
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
  }

  @Test(priority = 2)
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
