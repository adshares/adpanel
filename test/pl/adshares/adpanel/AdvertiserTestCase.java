package pl.adshares.adpanel;

import pl.adshares.adpanel.data.campaign.CampaignAdv;
import pl.adshares.adpanel.data.campaign.CampaignBasicInfo;
import pl.adshares.adpanel.pages.advertiser.*;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class AdvertiserTestCase extends BrowserTestCase {

  private pl.adshares.adpanel.pages.LoginPage loginPage;
  private pl.adshares.adpanel.pages.DashboardPopup dashboardPopup;


  @Test
  public void createAdvertiserCampaign() {
    loginPage = new pl.adshares.adpanel.pages.LoginPage(driver);
    loginPage.loginSignIn("test@gmail.com", "password12345");

    boolean userHasAdvertiserAndPublisherPrivilegde = true;
    if (userHasAdvertiserAndPublisherPrivilegde) {
      dashboardPopup = new pl.adshares.adpanel.pages.DashboardPopup(driver);
      dashboardPopup.popUpAdvertiser();
    }

    AdvertiserMainPage amp = new AdvertiserMainPage(driver);
    amp.createNewCampaign();

    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
//    LocalDate endDate = null;
    final CampaignBasicInfo campInfo = new CampaignBasicInfo("campaign 1", "http://google.com", "CPM", "0.01", "1", startDate, endDate);
    ecBasicInformationPage.fillInForm(campInfo);
    ecBasicInformationPage.saveData();
    //ecBasicInformationPage.goBack();

    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);

//    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.REQUIRED);
//    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.EXCLUDED);
//    ecTargetPage.toggleRequireBox();
//    ecTargetPage.toggleExcludeBox();
    ecTargetPage.saveData();

    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);


    final CampaignAdv campAdv = new CampaignAdv("Advertisement #1", "html", "<div style=\"width:100px;height:50px;background-color:red;\" />", "900x120");
    ecCreateAdsPage.addAdvertisement(campAdv);
    ecCreateAdsPage.saveData();

    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.checkCampaignSummary(campInfo);
    ecSummaryPage.startCampaignButton();

  }
}
