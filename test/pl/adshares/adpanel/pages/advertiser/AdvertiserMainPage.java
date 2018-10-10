package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.data.campaign.CampaignAdv;
import pl.adshares.adpanel.data.campaign.CampaignBasicInfo;
import pl.adshares.adpanel.pages.admin.AdminMainPage;
import pl.adshares.adpanel.tools.RandomPage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.AfterClass;

public class AdvertiserMainPage {

  @FindBy(css = "[data-test='header-create-new-asset-button']")                                                         private WebElement createNewCampaignTopButton2;
  @FindBy(css = "[src='assets/images/plus-circle.svg']")                                                                private WebElement createNewCampaignTopButton3;
  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement createNewCampaignTopButton;
  @FindBy(css = "[data-test='user-total-funds']")                                                                       private WebElement AssertUserTotalFunds;
  @FindBy(css = "[data-test='user-total-funds-in-currency']")                                                           private WebElement AssertUserTotalFundsInCurrency;
  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement AssertNgStarInserted;
  @FindBy(css = "[class='adsh-campaign-list__items']")                                                                  private WebElement AssertAdshCampaignListItems;
  @FindBy(css = "[data-test='user-address']")                                                                           private WebElement AssertUserAddress;
  @FindBy(xpath = "//*[contains(text(), 'Total Funds:')]")                                                              private WebElement AssertUserTotalFunds2;
  @FindBy(xpath = "//*[contains(text(), 'Basic Information')]")                                                          private WebElement AssertBasicInformation ;

  private WebDriver driver;
  private WebDriverWait wait;

  public AdvertiserMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  private void createNewCampaign() {
    wait.until(ExpectedConditions.visibilityOf(createNewCampaignTopButton));
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    createNewCampaignTopButton.click();
    wait.until(ExpectedConditions.visibilityOf(AssertBasicInformation));
    Assert.assertEquals("Basic Information", AssertBasicInformation.getText());
    System.out.println("Assert - Create New Campaign");
  }
  public void createCampaign() {
//    Krok 1. [Basic Information]
    AdvertiserMainPage amp = new AdvertiserMainPage(driver);
    amp.createNewCampaign();
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
//    LocalDate endDate = null;
    final CampaignBasicInfo campInfo = new CampaignBasicInfo("campaign 1", "http://google.com", "CPM", "0.01", "1", startDate, endDate);
    ecBasicInformationPage.fillInForm(campInfo);
    System.out.println("Assert - Basic Information");
  }
  public void createCampaignSaveData() {
//    Krok 1. [Basic Information-saveData]

    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.saveData();
    System.out.println("Assert - Basic Information [saveData]");
  }
  public void createCampaignGoBack() {
//    Krok 1. [Basic Information-goBack]
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.goBack();
    System.out.println("Assert - Basic Information [goBack]");
  }
  public void createCampaignAdditionalTargeting() {
//    Krok 2. [Additional Targeting]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
//    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.REQUIRED);
//    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.EXCLUDED);
//    ecTargetPage.toggleRequireBox();
//    ecTargetPage.toggleExcludeBox();
    System.out.println("Assert - Additional Targeting - OK");
  }
  public void createCampaignAdditionalTargetingSaveData() {
//    Krok 2. [Additional Targeting-saveData]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveData();
    System.out.println("Assert - Additional Targeting [saveData]");
  }
  public void createCampaignAdditionalTargetingGoBack() {
//    Krok 2. [Additional Targeting-goBack]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.goBack();
    System.out.println("Assert - Additional Targeting [goBack]");
  }
  public void createCampaignAdditionalTargetingSaveDataAsDraft() {
//    Krok 2. [Additional Targeting-saveDataAsDraft]
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveDataAsDraft();
    System.out.println("Assert - Additional Targeting [saveDataAsDraft]");
  }

  public void createCampaignCreateAds() {
//    Krok 3. [Create Ads]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    final CampaignAdv campAdv = new CampaignAdv("Advertisement #1", "html", "<div style=\"width:100px;height:50px;background-color:red;\" />", "900x120");
    ecCreateAdsPage.addAdvertisement(campAdv);
    System.out.println("Assert - Create Ads");
  }
  public void createCampaignCreateAdsSaveData() {
//    Krok 3. [Create Ads - SaveData]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveData();
    System.out.println("Assert - Create Ads - [saveData]");
  }
  public void createCampaignCreateAdsGoBack() {
//    Krok 3. [Create Ads - goBack]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.goBack();
    System.out.println("Assert - Create Ads - [goBack]");
  }
  public void createCampaignCreateAdsSaveDataAsDraft() {
//    Krok 3. [Create Ads - saveDataAsDraft]
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveDataAsDraft();
    System.out.println("Assert - Create Ads - [saveDataAsDraft]");
  }

  public void createCampaignSummary() {
//    Krok 4. [Summary]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
    final CampaignBasicInfo campInfo = new CampaignBasicInfo("campaign 1", "http://google.com", "CPM", "0.01", "1", startDate, endDate);
    ecSummaryPage.checkCampaignSummary(campInfo);
    System.out.println("Assert - Summary");
  }
  public void createCampaignSummaryGoBack() {
//    Krok 4. [Summary - goBack]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.goBack();
    System.out.println("Assert - Summary - [goBack]");
  }
  public void createCampaignSummaryStartCampaignButton() {
//    Krok 4. [Summary - startCampaignButton]
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.startCampaignButton();
    System.out.println("Assert - Summary - [startCampaignButton]");
  }

  public void advertiserMyCampaign() {
    int id = 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserTotalFunds));
    Assert.assertTrue(AssertUserTotalFunds.isDisplayed());
    System.out.println(id + "/6. Assert UserTotalFunds - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserTotalFundsInCurrency));
    Assert.assertTrue(AssertUserTotalFundsInCurrency.isDisplayed());
    System.out.println(id + "/6. Assert UserTotalFundsInCurrency - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertNgStarInserted));
    Assert.assertTrue(AssertNgStarInserted.isDisplayed());
    System.out.println(id + "/6. Assert NgStarInserted - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertAdshCampaignListItems));
    Assert.assertTrue(AssertAdshCampaignListItems.isDisplayed());
    System.out.println(id + "/6. Assert AdshCampaignListItems - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserTotalFunds2));
    Assert.assertTrue(AssertUserTotalFunds2.isDisplayed());
    System.out.println(id + "/6. Assert UserTotalFunds2 - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserAddress));
    Assert.assertTrue(AssertUserAddress.isDisplayed());
    System.out.println(id + "/6. Assert UserAddress - OK");
  }
}
