import adsharesDemo.DesktopPage;
import adsharesDemo.LoginPage;
import adsharesDemo.advertiser.*;
import org.testng.annotations.Test;
import testsSetup.BrowserSetup;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LoginAdshares extends BrowserSetup {


  @Test()
  public void loginTest() {
    loginPage = new LoginPage(driver);

    loginPage.loginSignIn(loginAdService, passwordAdService);
    desktopPage = new DesktopPage(driver);
    desktopPage.popUpPublisher();
  }

  @Test
  public void createAdvertiserCampaign() {
    loginPage = new LoginPage(driver);
    loginPage.loginSignIn("test@gmail.com", "password12345");

    boolean userHasAdvertiserAndPublisherPrivilegde = true;
    if (userHasAdvertiserAndPublisherPrivilegde) {
      desktopPage = new DesktopPage(driver);
      desktopPage.popUpAdvertiser();
    }

    AdvertiserMainPage amp = new AdvertiserMainPage(driver);
    amp.createNewCampaign();

    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
//    LocalDate endDate = LocalDate.parse("5/2/2018", formatter);
    LocalDate endDate = null;
    final CampaignBasicInfo campInfo = new CampaignBasicInfo("campaign 1", "http://google.com", "CPM", "0.01", "1", startDate, endDate);
    ecBasicInformationPage.fillInForm(campInfo);
    ecBasicInformationPage.saveData();
    //ecBasicInformationPage.goBack();

    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);

    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.REQUIRED);
    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.EXCLUDED);
//    ecTargetPage.toggleRequireBox();
//    ecTargetPage.toggleExcludeBox();
    ecTargetPage.saveData();

    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.addAdvertisement();
    ecCreateAdsPage.saveData();

    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.checkCampaignSummary(campInfo);
    ecSummaryPage.startCampaignButton();

  }
}
