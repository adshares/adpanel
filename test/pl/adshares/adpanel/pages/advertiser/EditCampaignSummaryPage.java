package pl.adshares.adpanel.pages.advertiser;

import org.testng.Assert;
import pl.adshares.adpanel.data.campaign.CampaignBasicInfo;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pl.adshares.adpanel.tools.Maps;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

public class EditCampaignSummaryPage {

  private static final String DATE_PATTERN = "dd MMM uuuu";

  @FindBy(css = "[data-test='advertiser-campaign-name']")                                                               private WebElement basicInformationName;
  @FindBy(css = "[data-test='advertiser-campaign-target-url']")                                                         private WebElement basicInformationTargetUrl;
  @FindBy(css = "[data-test='advertiser-campaign-max-cpc']")                                                            private WebElement basicInformationMaxCpc;
  @FindBy(css = "[data-test='advertiser-campaign-max-cpm']")                                                            private WebElement basicInformationMaxCpm;
  @FindBy(css = "[data-test='advertiser-campaign-budget']")                                                             private WebElement basicInformationBudget;
  @FindBy(css = "[data-test='advertiser-campaign-start-date']")                                                         private WebElement basicInformationStartDate;
  @FindBy(css = "[data-test='advertiser-campaign-end-date']")                                                           private WebElement basicInformationEndDate;
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
    wait.until(ExpectedConditions.visibilityOf(basicInformationName));
    Assert.assertEquals(Maps.get_campaign_name("campaign_name"), basicInformationName.getText());
    Assert.assertEquals(Maps.get_target_url("target_url"), basicInformationTargetUrl.getText());
    Assert.assertEquals(Maps.get_Max_CPC("Max_CPC"), basicInformationMaxCpc.getText());
    Assert.assertEquals(Maps.get_Max_CPM("Max_CPM"), basicInformationMaxCpm.getText());
    if (Maps.get_ADS_day("ADS_day")!=null){
      Assert.assertEquals(Maps.get_ADS_day("ADS_day"), basicInformationBudget.getText());
    }

    System.out.println("campaign_name: "+ Maps.get_campaign_name("campaign_name"));
    System.out.println("target_url:    "+Maps.get_target_url("target_url"));
    System.out.println("Max_CPC:       "+Maps.get_Max_CPC("Max_CPC"));
    System.out.println("Max_CPM:       "+Maps.get_Max_CPM("Max_CPM"));
    System.out.println("ADS_day:       "+Maps.get_ADS_day("ADS_day"));
    System.out.println("ADS_hour:      "+Maps.get_ADS_hour("ADS_hour"));
    System.out.println("date_of_start: "+Maps.get_date_of_start("date_of_start"));
    System.out.println("date_of_end:   "+Maps.get_date_of_end("date_of_end"));

    String campaignBudgetText = basicInformationBudget.getText();
    String budget = campaignBudgetText.replaceAll("[^\\d.]", "");

    String startDateAsString = basicInformationStartDate.getText();
    String endDateAsString = basicInformationEndDate.getText();
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


//    CampaignBasicInfo campInfo = new CampaignBasicInfo(name, targetUrl, Max_CPC, Max_CPM, ADS_day, ADS_hour, startDate, endDate);
//    System.out.println(campInfo);
//    assert campaign basic info
//    boolean isEqual = campInfo.equals(info);
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
