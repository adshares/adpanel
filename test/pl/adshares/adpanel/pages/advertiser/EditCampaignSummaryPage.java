package pl.adshares.adpanel.pages.advertiser;

import pl.adshares.adpanel.data.campaign.CampaignBasicInfo;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

public class EditCampaignSummaryPage {

  private static final String DATE_PATTERN = "dd MMM uuuu";

  @FindBy(css = "[data-test='advertiser-campaign-name']")                                                               private WebElement campaignNameText;
  @FindBy(css = "[data-test='advertiser-campaign-target-url']")                                                         private WebElement campaignTargetUrl;
  @FindBy(css = "[data-test='advertiser-campaign-bid-strategy']")                                                       private WebElement campaignBidStrategyComplex;
  @FindBy(css = "[data-test='advertiser-campaign-budget']")                                                             private WebElement campaignBudget;
  @FindBy(css = "[data-test='advertiser-campaign-start-date']")                                                         private WebElement campaignStartDate;
  @FindBy(css = "[data-test='advertiser-campaign-end-date']")                                                           private WebElement campaignEndDate;
  @FindBy(css = "[data-test='advertiser-edit-campaign-navigate-back']")                                                 private WebElement backButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-as-draft']")                                                 private WebElement saveAsDraftButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-start-campaign']")                                                private WebElement startCampaignButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignSummaryPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void checkCampaignSummary(CampaignBasicInfo info) {
    System.out.println("---------- checkCampaignSummary ----------");
    wait.until(ExpectedConditions.visibilityOf(campaignNameText));
    String name = campaignNameText.getText();
    String targetUrl = campaignTargetUrl.getText();
//    String[] bidStrategyArr = campaignBidStrategyComplex.getText().split(" ");
    String bidStrategy = campaignBidStrategyComplex.getText();
    String bidValue = campaignBudget.getText();
    System.out.println("campaignName:      "+name);
    System.out.println("targetUrl:         "+targetUrl);
    System.out.println("bidStrategyArr:    "+bidStrategy);
    System.out.println("bidStrategyArr:    "+bidValue);

//    String bidStrategy = bidStrategyArr[0];
//    String bidValue = bidStrategyArr[1].replaceAll("[^\\d.]", "");

    String campaignBudgetText = campaignBudget.getText();
    String budget = campaignBudgetText.replaceAll("[^\\d.]", "");

    String startDateAsString = campaignStartDate.getText();
    String endDateAsString = campaignEndDate.getText();
    System.out.println("startDateAsString: "+startDateAsString);
    System.out.println("endDateAsString:   "+endDateAsString);
    LocalDate startDate = null;
    LocalDate endDate = null;
    final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN, Locale.US);
    try {
      startDate = LocalDate.parse(startDateAsString, formatter);
    } catch (DateTimeParseException dtpe) {
      System.out.println("EditCampaignSummaryPage: incorrect format of start date");
    }
    if (!"-".equals(endDateAsString)) {
      try {
        endDate = LocalDate.parse(endDateAsString, formatter);
      } catch (DateTimeParseException dtpe) {
        System.out.println("EditCampaignSummaryPage: incorrect format of end date");
      }
    }


    CampaignBasicInfo campInfo = new CampaignBasicInfo(name, targetUrl,
      bidStrategy, bidValue, budget, startDate, endDate);
//    System.out.println(campInfo);
//    assert campaign basic info
    boolean isEqual = campInfo.equals(info);
//    Assert.assertTrue(isEqual);
  }

  public void startCampaignButton() {
    wait.until(ExpectedConditions.visibilityOf(startCampaignButton));
    startCampaignButton.click();
  }

  public void saveDataAsDraft() {
    wait.until(ExpectedConditions.visibilityOf(saveAsDraftButton));
    saveAsDraftButton.click();
  }

  public void goBack() {
    wait.until(ExpectedConditions.visibilityOf(backButton));
    backButton.click();

  }
}
