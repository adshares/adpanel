package net.adshares.pages.advertiser;

import net.adshares.data.campaign.CampaignBasicInfo;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

/**
 * Page for entering basic campaign data (first stage of campaign editing).
 */
public class EditCampaignBasicInfoPage {
  /**
   * Date pattern used on basic information campaign page. It is used as pattern of DateTimeFormatter.
   */
  private static final String DATE_PATTERN = "M/d/uuuu";

  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-name']")
  private WebElement campaignNameInput;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-target-url']")
  private WebElement campaignTargetURLInput;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-bid-strategy-select']")
  private WebElement campaignBidStrategySelect;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-option']")
  private List<WebElement> campaignBidStrategyList;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-bid-value']")
  private WebElement campaignBidValueInput;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-budget']")
  private WebElement campaignBudgetInput;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-start-date']")
  private WebElement campaignStartDateInput;
  @FindBy(css = "[data-test='advertiser-edit-campaign-basic-information-form-end-date']")
  private WebElement campaignEndDateInput;
  @FindBy(css = "[data-test='advertiser-navigate-to-dashboard']")
  private WebElement backButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-and-continue']")
  private WebElement saveButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignBasicInfoPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void fillInForm(CampaignBasicInfo campInfo) {
    wait.until(ExpectedConditions.visibilityOf(campaignNameInput));

    campaignNameInput.sendKeys(campInfo.getName());
    campaignTargetURLInput.sendKeys(campInfo.getTargetUrl());

    campaignBidStrategySelect.click();
    wait.until(ExpectedConditions.visibilityOf(campaignBidStrategyList.get(0)));

    // select bid strategy by text
    for (WebElement we : campaignBidStrategyList) {
      String text = we.getAttribute("value");
      if (campInfo.getBidStrategy().equals(text)) {
        we.click();
        break;
      }
    }

    campaignBidValueInput.sendKeys(campInfo.getBidValue());
    campaignBudgetInput.sendKeys(campInfo.getBudget());

    // set date
    clearInput(campaignStartDateInput);
    final LocalDate startDate = campInfo.getStartDate();
    final LocalDate endDate = campInfo.getEndDate();
    final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN, Locale.US);

    String startDateAsString = startDate.format(formatter);
    campaignStartDateInput.sendKeys(startDateAsString);

    if (endDate != null) {
      // end date should be input only, if it is defined
      String endDateAsString = endDate.format(formatter);
      campaignEndDateInput.sendKeys(endDateAsString);
    }
  }

  /**
   * Removes all characters from input.
   *
   * @param webElementInput input element
   */
  private void clearInput(WebElement webElementInput) {
    // Characters are deleted by backspace.
    String value = webElementInput.getAttribute("value");
    int length = value.length();
    if (length > 0) {
      // backspace ascii code is 8
      char bsChar = (char) 8;
      StringBuilder sb = new StringBuilder();
      for (int i = 0; i < length; i++) {
        sb.append(bsChar);
      }
      webElementInput.sendKeys(sb);
    }
  }

  public void saveData() {
    wait.until(ExpectedConditions.visibilityOf(saveButton));
    saveButton.click();
  }

  public void goBack() {
    wait.until(ExpectedConditions.visibilityOf(backButton));
    backButton.click();

    driver.switchTo().alert().accept();
  }

}
