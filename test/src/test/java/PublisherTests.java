import adsharesDemo.DashboardPopup;
import adsharesDemo.LoginPage;
import adsharesDemo.publisher.*;
import org.testng.annotations.Test;
import testsSetup.BrowserSetup;

public class PublisherTests extends BrowserSetup {

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
