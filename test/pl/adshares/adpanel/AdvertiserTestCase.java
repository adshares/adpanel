package pl.adshares.adpanel;

import pl.adshares.adpanel.data.campaign.CampaignAdv;
import pl.adshares.adpanel.data.campaign.CampaignBasicInfo;
import pl.adshares.adpanel.pages.DashboardPopup;
import pl.adshares.adpanel.pages.advertiser.*;
import pl.adshares.adpanel.pages.LoginPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import org.testng.annotations.Test;
import pl.adshares.adpanel.tools.RandomPage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class AdvertiserTestCase extends BrowserTestCase {

  private LoginPage loginPage;
  private AdvertiserMainPage advertiserMainPage;
  private DashboardPopup dashboardPopup;

  @Test
  public void createAdvertiserCampaign() {
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createCampaign();
    advertiserMainPage.createCampaignSaveData();
    advertiserMainPage.createCampaignAdditionalTargeting();
    advertiserMainPage.createCampaignAdditionalTargetingSaveData();
    advertiserMainPage.createCampaignCreateAds();
    advertiserMainPage.createCampaignCreateAdsSaveData();
    advertiserMainPage.createCampaignSummary();
    advertiserMainPage.createCampaignSummaryStartCampaignButton();
    }
  @Test
  public void backAdvertiserCampaign() {
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createCampaign();
    advertiserMainPage.createCampaignSaveData();
    advertiserMainPage.createCampaignAdditionalTargeting();
    advertiserMainPage.createCampaignAdditionalTargetingSaveData();
    advertiserMainPage.createCampaignCreateAds();
    advertiserMainPage.createCampaignCreateAdsSaveData();
    advertiserMainPage.createCampaignSummary();
    advertiserMainPage.createCampaignSummaryGoBack();
    advertiserMainPage.createCampaignCreateAdsGoBack();
    advertiserMainPage.createCampaignAdditionalTargetingGoBack();
    advertiserMainPage.createCampaignGoBack();
  }
  @Test
  public void saveAsDraftAdvertiserCampaign() {
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createCampaign();
    advertiserMainPage.createCampaignSaveData();
    advertiserMainPage.createCampaignAdditionalTargeting();
    advertiserMainPage.createCampaignAdditionalTargetingSaveDataAsDraft();
    // TODO: 27.07.18 błąd 500 przy SaveDataAsDraft
    advertiserMainPage.createCampaignCreateAds();
    advertiserMainPage.createCampaignCreateAdsSaveData();
    advertiserMainPage.createCampaignSummary();
    advertiserMainPage.createCampaignSummaryGoBack();
    advertiserMainPage.createCampaignCreateAdsGoBack();
    advertiserMainPage.createCampaignAdditionalTargetingGoBack();
    advertiserMainPage.createCampaignGoBack();
  }
  @Test
  public void saveBasicInformationAdvertiserCampaign() {
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createCampaign();
    advertiserMainPage.createCampaignSaveData();
  }

  @Test
  public void saveAdditionalTargetingCampaign() {
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createCampaign();
    advertiserMainPage.createCampaignSaveData();
    advertiserMainPage.createCampaignAdditionalTargeting();
    advertiserMainPage.createCampaignAdditionalTargetingSaveData();
  }

}
