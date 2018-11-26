package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.data.campaign.CampaignAdv;
import pl.adshares.adpanel.data.campaign.CampaignBasicInfo;
import pl.adshares.adpanel.tools.Maps;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

public class AdvertiserMainPage {

  @FindBy(css = "[data-test='header-dashboard-link']")                                                                  private WebElement dashboardLink;
  @FindBy(css = "[data-test='header-create-new-asset-button']")                                                         private WebElement createNewCampaignTopButton2;
  @FindBy(css = "[src='assets/images/plus-circle.svg']")                                                                private WebElement createNewCampaignTopButton3;
  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement createNewCampaignTopButton;
  @FindBy(xpath = "//*[contains(text(), 'Basic Information')]")                                                         private WebElement AssertBasicInformation;
  @FindBy(xpath = "//*[contains(text(), 'Campaign Name')]")                                                             private WebElement AssertBasicInformation1;
  @FindBy(xpath = "//*[contains(text(), 'Target URL')]")                                                                private WebElement AssertBasicInformation2;
  @FindBy(xpath = "//*[contains(text(), 'Max CPC')]")                                                                   private WebElement AssertBasicInformation3;
  @FindBy(xpath = "//*[contains(text(), 'Max CPM')]")                                                                   private WebElement AssertBasicInformation4;
  @FindBy(xpath = "//*[contains(text(), 'Budget (ADS / day)')]")                                                          private WebElement AssertBasicInformation5;
  @FindBy(xpath = "//*[contains(text(), 'Budget (ADS / hour)')]")                                                       private WebElement AssertBasicInformation6;
  @FindBy(xpath = "//*[contains(text(), 'Date of Start')]")                                                             private WebElement AssertBasicInformation7;
  @FindBy(xpath = "//*[contains(text(), 'Date of End')]")                                                               private WebElement AssertBasicInformation8;
  @FindBy(xpath = "//*[contains(text(), 'My Campaigns')]")                                                              private WebElement AssertMyCampaigns;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'Create new Ad')]")                                                             private WebElement createNewAd;
  @FindBy(xpath = "//*[contains(text(), 'Create Ads')]")                                                                private WebElement AssertCreateAds;
  @FindBy(xpath = "//*[@data-test='advertiser-create-new-campaign']")                                                   private WebElement addNewCampaign;
  @FindBy(xpath = "//*[@class='adsh-campaign-list__items']")                                                            private WebElement campaignList;
  @FindBy(xpath = "//*[contains(text(), 'Edit Campaign')]")                                                             private WebElement editCampaign;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-summary-navigate-to-basic-information']//button")           private WebElement editBasicInfo;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-summary-navigate-to-create-ads']//button")                  private WebElement editCreateAds;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-summary-navigate-to-additional-targeting']//button")        private WebElement editAdditionalTargeting;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-budget-per-day']")                         private WebElement campaignADSdayInput;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-budget']")                                 private WebElement campaignADSHourInput;

  @FindBy(xpath = "//*[contains(text(), 'Campaign name required!')]")                                                   private WebElement AssertBasicInformation14;
  @FindBy(xpath = "//*[contains(text(), 'Please provide a valid URL.')]")                                               private WebElement AssertBasicInformation9;
  @FindBy(xpath = "//*[contains(text(), 'Budget required')]")                                                           private WebElement AssertBasicInformation10;
  @FindBy(xpath = "//*[contains(text(), 'Short headline required!')]")                                                  private WebElement AssertBasicInformation11;
  @FindBy(xpath = "//*[contains(text(), 'Html required!')]")                                                            private WebElement AssertBasicInformation12;
  @FindBy(xpath = "//*[contains(text(), 'Image required')]")                                                            private WebElement AssertBasicInformation13;
  @FindBy(xpath = "//*[contains(text(), 'Max CPC required')]")                                                          private WebElement AssertBasicInformation15;
  @FindBy(xpath = "//*[contains(text(), 'Max CPM required')]")                                                          private WebElement AssertBasicInformation16;
  @FindBy(xpath = "//*[contains(text(), 'Allowed minimum is 0.01')]")                                                   private WebElement AssertBasicInformation17;
  @FindBy(xpath = "//*[contains(text(), 'Allowed minimum is 0.0004')]")                                                 private WebElement AssertBasicInformation18;

  private WebDriver driver;
  private WebDriverWait wait;

  public AdvertiserMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }
  private void sleep(int czas) {
      int x=0;
      for (x=0; x>czas; x--) {
        try {
          Thread.sleep(1000);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
        System.out.println("sleep: "+czas+"s.");
        x=x-1;
      }
  }
  public void createNewCampaign() {//header-create-new-asset-button
    System.out.println("---------- headerCreateNewCampaign ----------");
    wait.until(ExpectedConditions.visibilityOf(createNewCampaignTopButton));
    try {
      Thread.sleep(2000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    createNewCampaignTopButton.click();
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation));
    Assert.assertEquals("Basic Information", AssertBasicInformation.getText());
    System.out.println("Click  - header create new Campaign");
  }
  public void basicInformation() {                                                          // Krok 1. Basic Information
    System.out.println("---------- basicInformation ----------");
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation));
    Assert.assertEquals("Basic Information", AssertBasicInformation.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation1));
    Assert.assertEquals("Campaign Name", AssertBasicInformation1.getText());
    Assert.assertEquals("Target URL", AssertBasicInformation2.getText());
    Assert.assertEquals("Max CPC (ADS)", AssertBasicInformation3.getText());
    Assert.assertEquals("Max CPM (ADS)", AssertBasicInformation4.getText());
    Assert.assertEquals("Budget (ADS / day)", AssertBasicInformation5.getText());
    Assert.assertEquals("Budget (ADS / hour)", AssertBasicInformation6.getText());
    Assert.assertEquals("Date of Start", AssertBasicInformation7.getText());
    Assert.assertEquals("Date of End", AssertBasicInformation8.getText());
    Random random = new Random();
    int number = random.nextInt(1000);
    String campaign_name = "campaign_"+number;
    String target_url = "https://github.com/adshares/adpanel/branches";
    String Max_CPC = String.valueOf(number);
    String Max_CPM = String.valueOf(number);
    String ADS_day = String.valueOf(number);
    String ADS_hour = "0,"+number;
    String date_of_start = "5/1/2018";
    String date_of_end = "5/8/2018";

    Maps.createBasicInformation();
    Maps.campaign_name("campaign_name",campaign_name);
    Maps.target_url("target_url",target_url);
    Maps.Max_CPC("Max_CPC",Max_CPC);
    Maps.Max_CPM("Max_CPM",Max_CPM);
//    Maps.ADS_day("ADS_day",ADS_day);
//    Maps.ADS_hour("ADS_hour",ADS_hour);
    Maps.date_of_start("date_of_start",date_of_start);
    Maps.date_of_end("date_of_end",date_of_end);

    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse(date_of_start, formatter);
    LocalDate endDate = LocalDate.parse(date_of_end, formatter);
//    final CampaignBasicInfo campInfo = new CampaignBasicInfo(Maps.get_campaign_name("campaign_name"), Maps.get_url_target("url_target"), "CPM", "0."+number, ""+number, startDate, endDate);
    final CampaignBasicInfo campInfo = new CampaignBasicInfo(campaign_name, target_url, Max_CPC, Max_CPM, ADS_day, ADS_hour, startDate, endDate);
    ecBasicInformationPage.fillInForm(campInfo);



    System.out.println("campaign_name: "+Maps.get_campaign_name("campaign_name"));
    System.out.println("target_url:    "+Maps.get_target_url("target_url"));
    System.out.println("Max_CPC:       "+Maps.get_Max_CPC("Max_CPC"));
    System.out.println("Max_CPM:       "+Maps.get_Max_CPM("Max_CPM"));
    System.out.println("ADS_day:       "+Maps.get_ADS_day("ADS_day"));
    System.out.println("ADS_hour:      "+Maps.get_ADS_hour("ADS_hour"));
    System.out.println("date_of_start: "+Maps.get_date_of_start("date_of_start"));
    System.out.println("date_of_end:   "+Maps.get_date_of_end("date_of_end"));

  }
  public void basicInformationSaveContinue() {                            // Krok 1. Basic Information [Save & Continue]
    System.out.println("---------- basicInformation [Save & Continue] ----------");
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.saveData();
    System.out.println("Click  - "+AssertBasicInformation.getText()+" [Save & Continue]");
//    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
//    Assert.assertEquals("1. Requires", AssertAdditionalTargeting1.getText());
//    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting2));
//    Assert.assertEquals("2. Excludes", AssertAdditionalTargeting2.getText());
  }
  public void basicInformationBackToDashboard() {                       // Krok 1. Basic Information [Back to Dashboard]
    System.out.println("---------- basicInformation [Back to Dashboard] ----------");
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.goBack();
    System.out.println("Click - Basic Information [Back to Dashboard]");
    wait.until(ExpectedConditions.visibilityOf(AssertMyCampaigns));
    Assert.assertTrue(AssertMyCampaigns.isDisplayed());
  }
  public void additionalTargeting() {                                                    // Krok 2. Additional Targeting
    System.out.println("---------- additionalTargeting ----------");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    Maps.createAdditionalTargeting();
    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.REQUIRED);
    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.EXCLUDED);
    System.out.println("requires1: "+Maps.get_requires1("requires1"));
    System.out.println("requires2: "+Maps.get_requires2("requires2"));
    System.out.println("requires3: "+Maps.get_requires3("requires3"));
    System.out.println("excludes1: "+Maps.get_excludes1("excludes1"));
    System.out.println("excludes2: "+Maps.get_excludes2("excludes2"));
    System.out.println("excludes3: "+Maps.get_excludes3("excludes3"));
  }
  public void additionalTargetingsaveSaveContinue() {                     // Krok 2. Additional Targeting [SaveContinue]
    System.out.println("---------- additionalTargeting [Save & Continue] ----------");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveData();
    System.out.println("Assert - Additional Targeting [Save & Continue]");
  }
  public void additionalTargetingsaveSaveDraft() {                           // Krok 2. Additional Targeting [SaveDraft]
    System.out.println("---------- additionalTargeting [Save Draft] ----------");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveDataAsDraft();
    System.out.println("Assert - Additional Targeting [Save Data As Draft]");
  }
  public void additionalTargetingsaveBack() {// Krok 2. Additional Targeting [Back]
    System.out.println("---------- additionalTargeting [Back] ----------");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.goBack();
    System.out.println("Assert - Additional Targeting [Back]");
  }
  public void createAds() {                                                                      // Krok 3. [Create Ads]
    System.out.println("---------- createAds ----------");
    createAdsHtml();
    createAdsImage();
  }
  public void createAdsHtml() {                                                                      // Krok 3. [Create Ads]
    System.out.println("---------- createAds - HTML ----------");
    String[] size = {"728x90","300x250","336x280","300x600","320x100","468x60","234x60","125x125","120x600","160x600","180x150","120x240","200x200","300x1050","250x250","320x50","970x90","970x250","750x100","750x200","750x300"};
    String html_short_headline="Advertisr HTML";
    String html_ad_type="html";
    String html_size = (size[new Random().nextInt(size.length)]);
    String html_code="<font color=\"red\">COLOR RED</font>";

    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    final CampaignAdv campAdv = new CampaignAdv(html_short_headline, html_ad_type, html_size, html_code);
    ecCreateAdsPage.addAdvertisement(campAdv);

    Maps.createAdsHtml();
    Maps.html_short_headline("html_short_headline",html_short_headline);
    Maps.html_ad_type("html_ad_type",html_ad_type);
    Maps.html_size("html_size",html_size);
    Maps.html_code("html_code",html_code);
    System.out.println("html_short_headline: "+Maps.get_html_short_headline("html_short_headline"));
    System.out.println("html_ad_type:        "+Maps.get_html_ad_type("html_ad_type"));
    System.out.println("html_size:           "+Maps.get_html_size("html_size"));
    System.out.println("html_code:           "+Maps.get_html_code("html_code"));
  }
  public void createAdsImage() {                                                                      // Krok 3. [Create Ads]
    System.out.println("---------- createAds - IMAGE----------");
    String[] size = {"728x90","300x250","336x280","300x600","320x100","468x60","234x60","125x125","120x600","160x600","180x150","120x240","200x200","300x1050","250x250","320x50","970x90","970x250","750x100","750x200","750x300"};
    String image_short_headline="Advertiser IMAGE";
    String image_ad_type="image";
    String image_size = (size[new Random().nextInt(size.length)]);
    String image_browse="/home/michal/Pobrane/Summary.jpg";

    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    final CampaignAdv campAdv = new CampaignAdv(image_short_headline, image_ad_type, image_size, image_browse);
    ecCreateAdsPage.addAdvertisement(campAdv);

    Maps.createAdsImage();
    Maps.image_short_headline("image_short_headline",image_short_headline);
    Maps.image_ad_type("image_ad_type",image_ad_type);
    Maps.image_size("image_size",image_size);
    Maps.image_browse("image_browse",image_browse);
    System.out.println("image_short_headline: "+Maps.get_image_short_headline("image_short_headline"));
    System.out.println("image_ad_type:        "+Maps.get_image_ad_type("image_ad_type"));
    System.out.println("image_size:           "+Maps.get_image_size("image_size"));
    System.out.println("image_browse:         "+Maps.get_image_browse("image_browse"));
  }

  public void createAdsSaveContinue() {//    Krok 3. Create Ads - [SaveData]
    System.out.println("---------- createAds [Save & Continue] ----------");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveData();
    System.out.println("Assert - Create Ads - [saveData]");
  }
  public void createAdsSaveAsDraft() {//    Krok 3. Create Ads - [saveDataAsDraft]
    System.out.println("---------- createAds [Save Draft] ----------");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveDataAsDraft();
    System.out.println("Assert - Create Ads - [saveDataAsDraft]");
  }
  public void createAdsBack() {//    Krok 3. Create Ads - [Back]
    System.out.println("---------- createAds [Back] ----------");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.goBack();
    System.out.println("Assert - Create Ads - [Back]");
  }

  public void summary() {//    Krok 4. Summary
    System.out.println("---------- summary ----------");
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse(Maps.get_date_of_start("date_of_start"), formatter);
    LocalDate endDate = LocalDate.parse(Maps.get_date_of_end("date_of_end"), formatter);
    final CampaignBasicInfo campInfo = new CampaignBasicInfo(Maps.get_campaign_name("campaign_name"), Maps.get_target_url("target_url"), Maps.get_Max_CPC("Max_CPC"), Maps.get_Max_CPM("Max_CPM"), Maps.get_ADS_day("ADS_day"), Maps.get_ADS_day("ADS_day"), startDate, endDate);
    ecSummaryPage.checkCampaignSummary(campInfo);
    System.out.println("Assert - Summary");
  }
  public void summarySaveContinue() {//    Krok 4. Summary - [SaveAsDraft]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.startCampaignButton();
    System.out.println("Assert - Summary - [SaveContinue]");
  }
  public void summarySaveAsDraft() {//    Krok 4. Summary - [SaveAsDraft]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.saveDataAsDraft();
    System.out.println("Assert - Summary - [SaveAsDraft]");
  }
  public void summaryBack() {//    Krok 4. Summary - [Back]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.goBack();
    System.out.println("Assert - Summary - [Back]");
  }

  public void viewTheCampaign() {
    System.out.println("---------- viewTheCampaign ----------");
    System.out.println("Campaign Name: "+Maps.get_campaign_name("campaign_name"));
    String s = Maps.get_campaign_name("campaign_name");

    String xpath;
    xpath = String.format(".//*[contains(text(), '%s')]", s);
    wait.until(ExpectedConditions.visibilityOf(campaignList));
    System.out.println("xpath: "+xpath);

    WebElement campaign;
    campaign = campaignList.findElement(By.xpath(xpath));
    System.out.println("campaign: "+campaign);

    wait.until(ExpectedConditions.visibilityOf(addNewCampaign));
    wait.until(ExpectedConditions.visibilityOf(campaign));
    campaign.click();
  }


  @FindBy(css = "[data-test='advertiser-campaign-name']")                                           private WebElement campaignName;
  public void viewTheCampaign2() {
    System.out.println("---------- viewTheCampaign ----------");
    wait.until(ExpectedConditions.visibilityOf(campaignList));
    wait.until(ExpectedConditions.visibilityOf(addNewCampaign));
    wait.until(ExpectedConditions.visibilityOf(campaignList));
    int i=0;
    while (i++<999) {

      String list_name;
      String list_status;
      list_name = String.format(".//app-campaign-list-item[%s]//h4", i);
      list_status = String.format(".//app-campaign-list-item[%s]//div[1]//div//div//div[1]//span", i);

      WebElement campaign_name;
      campaign_name = campaignList.findElement(By.xpath(list_name));
      WebElement campaign_status;
      campaign_status = campaignList.findElement(By.xpath(list_status));

      if (Maps.get_campaign_name("campaign_name").equals(campaign_name.getText())){
        Maps.campaign_status("campaign_status",campaign_status.getText());
        System.out.println("| id "+i+" | "+campaign_status.getText()+" | "+campaign_name.getText()+" |");
        campaign_name.click();
        break;
      }
    }
  }


  public void editTheCampaign() {
    System.out.println("---------- editTheCampaign ----------");
    wait.until(ExpectedConditions.visibilityOf(editCampaign));
    editCampaign.click();
    System.out.println("Click - editCampaign");
  }
  public void editBasicInformation() {
    wait.until(ExpectedConditions.visibilityOf(editBasicInfo));
    editBasicInfo.click();
    System.out.println("Click - editBasicInfo");
    basicInformation();
    basicInformationSaveContinue();
    wait.until(ExpectedConditions.visibilityOf(editBasicInfo));
    Assert.assertTrue(editBasicInfo.isDisplayed());
    System.out.println("Assert editBasicInfo");
  }
  public void editAdditionalTargeting() {
    wait.until(ExpectedConditions.visibilityOf(editAdditionalTargeting));
    editAdditionalTargeting.click();
    System.out.println("Click - editAdditionalTargeting");
    additionalTargeting();
    additionalTargetingsaveSaveContinue();
    wait.until(ExpectedConditions.visibilityOf(editAdditionalTargeting));
    Assert.assertTrue(editAdditionalTargeting.isDisplayed());
    System.out.println("Assert editAdditionalTargeting");
  }
  public void editAds() {
    wait.until(ExpectedConditions.visibilityOf(editCreateAds));
    editCreateAds.click();
    System.out.println("Click - editCreateAds");
    createAds();
    createAdsSaveContinue();
    wait.until(ExpectedConditions.visibilityOf(editCreateAds));
    Assert.assertTrue(editCreateAds.isDisplayed());
    System.out.println("Assert editCreateAds");
  }


  public void additionalTargetingREQUIRED(String target_1, String target_2, String target_3) {                                                    // Krok 2. Additional Targeting
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.advertiserTargetingAll(EditCampaignTargetingPage.TargetCategory.REQUIRED,target_1, target_2, target_3);
    System.out.println("REQUIRED: "+target_1+" > "+target_2+" > "+target_3);
  }
  public void additionalTargetingEXCLUDED(String target_1, String target_2, String target_3) {                                                    // Krok 2. Additional Targeting
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.advertiserTargetingAll(EditCampaignTargetingPage.TargetCategory.EXCLUDED,target_1, target_2, target_3);
    System.out.println("EXCLUDED: "+target_1+" > "+target_2+" > "+target_3);
  }

  public void basicInformationError() {
    wait.until(ExpectedConditions.visibilityOf(campaignADSdayInput));
    campaignADSdayInput.sendKeys("0");
    wait.until(ExpectedConditions.visibilityOf(campaignADSHourInput));
    campaignADSHourInput.sendKeys("0");
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.saveData();
    System.out.println("Click  - "+AssertBasicInformation.getText()+" [Save & Continue]");
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation14));
    Assert.assertEquals("Campaign name required!", AssertBasicInformation14.getText());
    Assert.assertEquals("Please provide a valid URL.", AssertBasicInformation9.getText());
    Assert.assertEquals("Budget required", AssertBasicInformation10.getText());
    Assert.assertEquals("Max CPC required", AssertBasicInformation15.getText());
    Assert.assertEquals("Max CPM required", AssertBasicInformation16.getText());
    Assert.assertEquals("Allowed minimum is 0.01", AssertBasicInformation17.getText());
    Assert.assertEquals("Allowed minimum is 0.0004", AssertBasicInformation18.getText());
  }

  @FindBy(css = "*[data-test='advertiser-edit-campaign-create-ads-create-new-ad']")                                     private WebElement advButton;
  @FindBy(css = "*[data-test='advertiser-edit-campaign-create-ads-form-ad-type-select']")                               private WebElement selectAdType;
  @FindBy(xpath = "//*[@class='mat-select-content ng-trigger ng-trigger-fadeInContent']//*[contains(text(), 'image')]") private WebElement selectAdTypeImage;
  @FindBy(xpath = "//*[@class='mat-select-content ng-trigger ng-trigger-fadeInContent']//*[contains(text(), 'html')]")  private WebElement selectAdTypeHtml;
  public void createAdsError() {
    System.out.println("---------- createAdsError ----------");
    wait.until(ExpectedConditions.elementToBeClickable(advButton));
    advButton.click();
//    Assert html
    System.out.print(selectAdType.getText()+" >>>>> ");
    wait.until(ExpectedConditions.elementToBeClickable(selectAdType));
    selectAdType.click();
    wait.until(ExpectedConditions.elementToBeClickable(selectAdTypeHtml));
    wait.until(ExpectedConditions.elementToBeClickable(selectAdTypeImage));
    selectAdTypeHtml.click();
    System.out.println(selectAdType.getText());
    createAdsSaveContinue();
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation11));
    Assert.assertEquals("Short headline required!", AssertBasicInformation11.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation12));
    Assert.assertEquals("Html required!", AssertBasicInformation12.getText());
//    Assert image
    System.out.print(selectAdType.getText()+" >>>>> ");
    wait.until(ExpectedConditions.elementToBeClickable(selectAdType));
    selectAdType.click();
    wait.until(ExpectedConditions.elementToBeClickable(selectAdTypeHtml));
    wait.until(ExpectedConditions.elementToBeClickable(selectAdTypeImage));
    selectAdTypeImage.click();
    System.out.println(selectAdType.getText());
    createAdsSaveContinue();
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation11));
    Assert.assertEquals("Short headline required!", AssertBasicInformation11.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation13));
    Assert.assertEquals("Image required", AssertBasicInformation13.getText());
  }

  @FindBy(xpath = "//*[@data-test='advertiser-campaign-status']")                                                       private WebElement status;
  @FindBy(xpath = "//*[@data-test='advertiser-campaign-status-toggle']")                                                private WebElement statusToggle;
  public void statusCampaign() {
    System.out.println("---------- statusCampaign ----------");
    wait.until(ExpectedConditions.elementToBeClickable(status));
    wait.until(ExpectedConditions.elementToBeClickable(statusToggle));
    wait.until(ExpectedConditions.elementToBeClickable(createNewAd));

    System.out.println("campaign_status_list: "+Maps.get_campaign_status("campaign_status").toLowerCase());
    System.out.println("campaign_ststus_view: "+status.getText());

    Assert.assertEquals(Maps.get_campaign_status("campaign_status").toLowerCase(), status.getText());

    System.out.print(status.getText()+" >>>>> ");
    statusToggle.click();
    System.out.println(status.getText());
    wait.until(ExpectedConditions.elementToBeClickable(dashboardLink));
    dashboardLink.click();
  }
}
