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

  @FindBy(css = "[data-test='header-create-new-asset-button']")                                                         private WebElement createNewCampaignTopButton;
  @FindBy(css = "[data-test='user-total-funds']")                                                                       private WebElement AssertUserTotalFunds;
  @FindBy(css = "[data-test='user-total-funds-in-currency']")                                                           private WebElement AssertUserTotalFundsInCurrency;
  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement AssertNgStarInserted;
  @FindBy(css = "[class='adsh-campaign-list__items']")                                                                  private WebElement AssertAdshCampaignListItems;
  @FindBy(css = "[data-test='user-address']")                                                                           private WebElement AssertUserAddress;
  @FindBy(xpath = "//*[contains(text(), 'Total Funds:')]")                                                              private WebElement AssertUserTotalFunds2;


  private WebDriver driver;
  private WebDriverWait wait;

  public AdvertiserMainPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public void createNewCampaign() {
    wait.until(ExpectedConditions.visibilityOf(createNewCampaignTopButton));
    createNewCampaignTopButton.click();
  }
  public void createCampaign() {
//    Krok 1. [Basic Information]
    int id = (int) RandomPage.getFromId("id");
    AdvertiserMainPage amp = new AdvertiserMainPage(driver);
    amp.createNewCampaign();
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
//    LocalDate endDate = null;
    final CampaignBasicInfo campInfo = new CampaignBasicInfo("campaign 1", "http://google.com", "CPM", "0.01", "1", startDate, endDate);
    ecBasicInformationPage.fillInForm(campInfo);
    System.out.println(id+". Basic Information - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignSaveData() {
//    Krok 1. [Basic Information-saveData]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.saveData();
    System.out.println(id+". Basic Information [saveData]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignGoBack() {
//    Krok 1. [Basic Information-goBack]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignBasicInfoPage ecBasicInformationPage = new EditCampaignBasicInfoPage(driver);
    ecBasicInformationPage.goBack();
    System.out.println(id+". Basic Information [goBack]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignAdditionalTargeting() {
//    Krok 2. [Additional Targeting]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
//    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.REQUIRED);
//    ecTargetPage.selectOption(EditCampaignTargetingPage.TargetCategory.EXCLUDED);
//    ecTargetPage.toggleRequireBox();
//    ecTargetPage.toggleExcludeBox();
    System.out.println(id+". Additional Targeting - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignAdditionalTargetingSaveData() {
//    Krok 2. [Additional Targeting-saveData]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveData();
    System.out.println(id+". Additional Targeting [saveData]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignAdditionalTargetingGoBack() {
//    Krok 2. [Additional Targeting-goBack]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.goBack();
    System.out.println(id+". Additional Targeting [goBack]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignAdditionalTargetingSaveDataAsDraft() {
//    Krok 2. [Additional Targeting-saveDataAsDraft]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignTargetingPage ecTargetPage = new EditCampaignTargetingPage(driver);
    ecTargetPage.saveDataAsDraft();
    System.out.println(id+". Additional Targeting [saveDataAsDraft]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }

  public void createCampaignCreateAds() {
//    Krok 3. [Create Ads]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    final CampaignAdv campAdv = new CampaignAdv("Advertisement #1", "html", "<div style=\"width:100px;height:50px;background-color:red;\" />", "900x120");
    ecCreateAdsPage.addAdvertisement(campAdv);
    System.out.println(id+". Create Ads - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignCreateAdsSaveData() {
//    Krok 3. [Create Ads - SaveData]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveData();
    System.out.println(id+". Create Ads - [saveData]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignCreateAdsGoBack() {
//    Krok 3. [Create Ads - goBack]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.goBack();
    System.out.println(id+". Create Ads - [goBack]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignCreateAdsSaveDataAsDraft() {
//    Krok 3. [Create Ads - saveDataAsDraft]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignCreateAdsPage ecCreateAdsPage = new EditCampaignCreateAdsPage(driver);
    ecCreateAdsPage.saveDataAsDraft();
    System.out.println(id+". Create Ads - [saveDataAsDraft]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }

  public void createCampaignSummary() {
//    Krok 4. [Summary]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/uuuu");
    LocalDate startDate = LocalDate.parse("5/1/2018", formatter);
    LocalDate endDate = LocalDate.parse("5/8/2018", formatter);
    final CampaignBasicInfo campInfo = new CampaignBasicInfo("campaign 1", "http://google.com", "CPM", "0.01", "1", startDate, endDate);
    ecSummaryPage.checkCampaignSummary(campInfo);
    System.out.println(id+". Summary - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignSummaryGoBack() {
//    Krok 4. [Summary - goBack]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.goBack();
    System.out.println(id+". Summary - [goBack]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void createCampaignSummaryStartCampaignButton() {
//    Krok 4. [Summary - startCampaignButton]
    int id = (int) RandomPage.getFromId("id");
    EditCampaignSummaryPage ecSummaryPage = new EditCampaignSummaryPage(driver);
    ecSummaryPage.startCampaignButton();
    System.out.println(id+". Summary - [startCampaignButton]"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }

  public void advertiserMyCampaign() {
    int id = (int) RandomPage.getFromId("id");
    wait.until(ExpectedConditions.visibilityOf(AssertUserTotalFunds));
    Assert.assertTrue(AssertUserTotalFunds.isDisplayed());
    System.out.println(id + ". Assert UserTotalFunds - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserTotalFundsInCurrency));
    Assert.assertTrue(AssertUserTotalFundsInCurrency.isDisplayed());
    System.out.println(id + ". Assert UserTotalFundsInCurrency - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertNgStarInserted));
    Assert.assertTrue(AssertNgStarInserted.isDisplayed());
    System.out.println(id + ". Assert NgStarInserted - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertAdshCampaignListItems));
    Assert.assertTrue(AssertAdshCampaignListItems.isDisplayed());
    System.out.println(id + ". Assert AdshCampaignListItems - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserTotalFunds2));
    Assert.assertTrue(AssertUserTotalFunds2.isDisplayed());
    System.out.println(id + ". Assert UserTotalFunds2 - OK");    id = id + 1;
    wait.until(ExpectedConditions.visibilityOf(AssertUserAddress));
    Assert.assertTrue(AssertUserAddress.isDisplayed());
    System.out.println(id + ". Assert UserAddress - OK");    id = id + 1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
}
