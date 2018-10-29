package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
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
import java.util.Random;

public class AdvertiserMainPage {

  @FindBy(css = "[data-test='header-create-new-asset-button']")                                                         private WebElement createNewCampaignTopButton2;
  @FindBy(css = "[src='assets/images/plus-circle.svg']")                                                                private WebElement createNewCampaignTopButton3;
  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement createNewCampaignTopButton;
//  @FindBy(css = "[data-test='user-total-funds']")                                                                       private WebElement AssertUserTotalFunds;
//  @FindBy(css = "[data-test='user-total-funds-in-currency']")                                                           private WebElement AssertUserTotalFundsInCurrency;
//  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement AssertNgStarInserted;
//  @FindBy(css = "[class='adsh-campaign-list__items']")                                                                  private WebElement AssertAdshCampaignListItems;
//  @FindBy(css = "[data-test='user-address']")                                                                           private WebElement AssertUserAddress;
//  @FindBy(xpath = "//*[contains(text(), 'Total Funds:')]")                                                              private WebElement AssertUserTotalFunds2;
  @FindBy(xpath = "//*[contains(text(), 'Basic Information')]")                                                         private WebElement AssertBasicInformation;
  @FindBy(xpath = "//*[contains(text(), 'Campaign Name')]")                                                             private WebElement AssertBasicInformation1;
  @FindBy(xpath = "//*[contains(text(), 'Target URL')]")                                                                private WebElement AssertBasicInformation2;
  @FindBy(xpath = "//*[contains(text(), 'Bid Strategy')]")                                                              private WebElement AssertBasicInformation3;
  @FindBy(xpath = "//*[contains(text(), 'Bid Value')]")                                                                 private WebElement AssertBasicInformation4;
  @FindBy(xpath = "//*[contains(text(), 'Budget (ADS / per day)')]")                                                    private WebElement AssertBasicInformation5;
  @FindBy(xpath = "//*[contains(text(), 'Date of Start')]")                                                             private WebElement AssertBasicInformation6;
  @FindBy(xpath = "//*[contains(text(), 'Date of End')]")                                                               private WebElement AssertBasicInformation7;

  @FindBy(xpath = "//*[contains(text(), 'My Campaigns')]")                                                              private WebElement AssertMyCampaigns;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'Create Ads')]")                                                                private WebElement AssertCreateAds;


  @FindBy(xpath = "//*[@class='adsh-campaign-list__items']")                                                            private WebElement campaignList;
  @FindBy(xpath = "//*[contains(text(), 'Edit Campaign')]")                                                             private WebElement editCampaign;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-summary-navigate-to-basic-information']//button")           private WebElement editBasicInfo;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-summary-navigate-to-create-ads']//button")                  private WebElement editCreateAds;
  @FindBy(xpath = "//*[@data-test='advertiser-edit-campaign-summary-navigate-to-additional-targeting']//button")        private WebElement editAdditionalTargeting;

  private WebDriver driver;
  private WebDriverWait wait;

  public AdvertiserMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }
  private void sleep(int czas) {
    try {
      Thread.sleep(czas);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
  public void createNewCampaign() {//header-create-new-asset-button
    System.out.println("---------- headerCreateNewCampaign ----------");
    wait.until(ExpectedConditions.visibilityOf(createNewCampaignTopButton));
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    createNewCampaignTopButton.click();
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation));
    Assert.assertEquals("Basic Information", AssertBasicInformation.getText());
    System.out.println("Click  - header create new Campaign");
  }
  public void basicInformation() {                                                          // Krok 1. Basic Information
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
    Random random = new Random();
    int number = random.nextInt(1000);
//    final CampaignBasicInfo campInfo = new CampaignBasicInfo(Maps.get_campaign_name("campaign_name"), Maps.get_url_target("url_target"), "CPM", "0."+number, ""+number, startDate, endDate);
    final CampaignBasicInfo campInfo = new CampaignBasicInfo(Maps.get_campaign_name("campaign_name"), "https://github.com/adshares/adpanel/branches", "CPM", "0."+number, ""+number, startDate, endDate);
    ecBasicInformationPage.fillInForm(campInfo);
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation));
    Assert.assertEquals("Basic Information", AssertBasicInformation.getText());
    System.out.println("Assert - "+AssertBasicInformation.getText());
    Assert.assertEquals("Campaign Name", AssertBasicInformation1.getText());
    System.out.println("Assert - "+AssertBasicInformation1.getText());
    Assert.assertEquals("Target URL", AssertBasicInformation2.getText());
    System.out.println("Assert - "+AssertBasicInformation2.getText());
    Assert.assertEquals("Bid Strategy", AssertBasicInformation3.getText());
    System.out.println("Assert - "+AssertBasicInformation3.getText());
    Assert.assertEquals("Bid Value", AssertBasicInformation4.getText());
    System.out.println("Assert - "+AssertBasicInformation4.getText());
    Assert.assertEquals("Budget (ADS / per day)", AssertBasicInformation5.getText());
    System.out.println("Assert - "+AssertBasicInformation5.getText());
    Assert.assertEquals("Date of Start", AssertBasicInformation6.getText());
    System.out.println("Assert - "+AssertBasicInformation6.getText());
    Assert.assertEquals("Date of End", AssertBasicInformation7.getText());
    System.out.println("Assert - "+AssertBasicInformation7.getText());
    System.out.println("Campaign Name: "+Maps.get_campaign_name("campaign_name"));
  }
  public void basicInformationSaveContinue() {                            // Krok 1. Basic Information [Save & Continue]
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.saveData();
    System.out.println("Click  - "+AssertBasicInformation.getText()+" [Save & Continue]");
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    Assert.assertEquals("1. Requires", AssertAdditionalTargeting1.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting1.getText());
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting2));
    Assert.assertEquals("2. Excludes", AssertAdditionalTargeting2.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting2.getText());
  }
  public void basicInformationBackToDashboard() {                       // Krok 1. Basic Information [Back to Dashboard]
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.goBack();
    System.out.println("Click - Basic Information [Back to Dashboard]");
    wait.until(ExpectedConditions.visibilityOf(AssertMyCampaigns));
    Assert.assertTrue(AssertMyCampaigns.isDisplayed());
    System.out.println("Assert - Basic Information "+AssertMyCampaigns.getText());
  }
  public void additionalTargeting() {                                                    // Krok 2. Additional Targeting
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.REQUIRED);
    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.EXCLUDED);
    System.out.println("Assert - Additional Targeting - OK");
  }
  public void additionalTargetingsaveSaveContinue() {                     // Krok 2. Additional Targeting [SaveContinue]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveData();
    System.out.println("Assert - Additional Targeting [Save & Continue]");
  }
  public void additionalTargetingsaveSaveDraft() {                           // Krok 2. Additional Targeting [SaveDraft]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveDataAsDraft();
    System.out.println("Assert - Additional Targeting [Save Data As Draft]");
  }
  public void additionalTargetingsaveBack() {                                     // Krok 2. Additional Targeting [Back]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.goBack();
    System.out.println("Assert - Additional Targeting [Back]");
  }
  public void createAds() {                                                                      // Krok 3. [Create Ads]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    final CampaignAdv campAdv = new CampaignAdv("Advertisement #1", "html", "<div style=\"width:100px;height:50px;background-color:red;\" />", "900x120");
    ecCreateAdsPage.addAdvertisement(campAdv);
    System.out.println("Assert - Create Ads");
  }
  public void createAdsSaveContinue() {//    Krok 3. Create Ads - [SaveData]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveData();
    System.out.println("Assert - Create Ads - [saveData]");
  }
  public void createAdsSaveAsDraft() {//    Krok 3. Create Ads - [saveDataAsDraft]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveDataAsDraft();
    System.out.println("Assert - Create Ads - [saveDataAsDraft]");
  }
  public void createAdsBack() {//    Krok 3. Create Ads - [Back]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.goBack();
    System.out.println("Assert - Create Ads - [Back]");
  }


  public void summary() {//    Krok 4. Summary - [SaveContinue]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
    final CampaignBasicInfo campInfo = new CampaignBasicInfo(Maps.get_campaign_name("campaign_name"), "http://google.com", "CPM", "0.01", "1", startDate, endDate);
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
    System.out.println("      viewTheCampaign");
    System.out.println("Campaign Name: "+Maps.get_campaign_name("campaign_name"));
    String xpath;
    String s = Maps.get_campaign_name("campaign_name");
    WebElement campaign;

    // TODO: 11.10.18 Zaślepka
    try {
      Robot robo = new Robot();
      robo.keyPress(KeyEvent.VK_F5);
      robo.keyRelease(KeyEvent.VK_F5);
    } catch (AWTException e) {
      e.printStackTrace();
    }
    try {
      Thread.sleep(10000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

      xpath = String.format(".//*[contains(text(), '%s')]", s);
      wait.until(ExpectedConditions.visibilityOf(campaignList));
          System.out.println("xpath: "+xpath);
      campaign = campaignList.findElement(By.xpath(xpath));
          System.out.println("campaign: "+campaign);
      wait.until(ExpectedConditions.visibilityOf(campaign));
      System.out.println("xpath: "+xpath);
      campaign.click();
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
    sleep(60000);
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
    sleep(60000);
  }


  public void additionalTargetingREQUIRED(String target_1, String target_2, String target_3) {                                                    // Krok 2. Additional Targeting
//    System.out.println("---------- additionalTargeting ----------");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.selectOptionTEST(EditCampaignTargetingPage.TargetCategory.REQUIRED,target_1, target_2, target_3);
    System.out.println("REQUIRED: "+target_1+" > "+target_2+" > "+target_3);
  }
  public void additionalTargetingEXCLUDED(String target_1, String target_2, String target_3) {                                                    // Krok 2. Additional Targeting
//    System.out.println("---------- additionalTargeting ----------");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.selectOptionTEST(EditCampaignTargetingPage.TargetCategory.EXCLUDED,target_1, target_2, target_3);
    System.out.println("EXCLUDED: "+target_1+" > "+target_2+" > "+target_3);
  }
}
