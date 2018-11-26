package pl.adshares.adpanel.pages.advertiser;

import org.openqa.selenium.interactions.Actions;
import pl.adshares.adpanel.data.campaign.CampaignAdv;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class EditCampaignCreateAdsPage {

  private static final String CSS_SELECTOR_ADV_HEADLINE = "[data-test='advertiser-edit-campaign-create-ads-form-name']";
  private static final String CSS_SELECTOR_ADV_IMAGE_UPLOAD_INPUT = "*[data-test='advertiser-edit-campaign-create-ads-form-image-upload']";
  private static final String CSS_SELECTOR_ADV_HTML_SAVE_BUTTON = "[data-test='advertiser-edit-campaign-create-ads-form-ad-html-save']";
  @FindBy(xpath = "//*[contains(text(), 'Save Html')]")                                                                 private WebElement saveHtml;
  private static final String CSS_SELECTOR_ADV_HTML_TEXTAREA = "*[data-test='advertiser-edit-campaign-create-ads-form-ad-html-textarea']";
  private static final String CSS_SELECTOR_ADV_SIZE_SELECT = "*[data-test='advertiser-edit-campaign-create-ads-form-size-select']";
  private static final String CSS_SELECTOR_ADV_TYPE_SELECT = "*[data-test='advertiser-edit-campaign-create-ads-form-ad-type-select']";

  @FindBy(css = "*[data-test='advertiser-edit-campaign-create-ads-create-new-ad']")                                     private WebElement advButton;
  @FindBy(css = "*[data-test='advertiser-edit-campaign-create-ads-form']")                                              private List<WebElement> advFormList;
  //  private WebElement advTypeSelect;
  @FindBy(css = "*[data-test='advertiser-edit-campaign-create-ads-form-ad-type-option']")                               private List<WebElement> advTypeOptionList;
  //  private WebElement advSizeSelect;
  @FindBy(css = "*[data-test='advertiser-edit-campaign-create-ads-form-size-option']")                                  private List<WebElement> advSizeOptionList;
  @FindBy(css = "[data-test='advertiser-edit-campaign-navigate-back']")                                                 private WebElement backButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-as-draft']")                                                 private WebElement saveAsDraftButton;
  @FindBy(css = "[data-test='advertiser-edit-campaign-save-and-continue']")                                             private WebElement saveButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public EditCampaignCreateAdsPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public void addAdvertisement(CampaignAdv campaignAdv) {

    wait.until(ExpectedConditions.elementToBeClickable(advButton));
    advButton.click();

    WebElement advBody = advFormList.get(advFormList.size() - 1);
    WebElement advHeadline = advBody.findElement(By.cssSelector(CSS_SELECTOR_ADV_HEADLINE));
    advHeadline.sendKeys(campaignAdv.getHeadline());

    WebElement advTypeSelect = advBody.findElement(By.cssSelector(CSS_SELECTOR_ADV_TYPE_SELECT));
    advTypeSelect.click();
    wait.until(ExpectedConditions.visibilityOf(advTypeOptionList.get(0)));
    for (WebElement we : advTypeOptionList) {
      String optionText = we.findElement(By.tagName("span")).getText();
      if (campaignAdv.getType().equalsIgnoreCase(optionText)) {
        we.click();
        wait.until(ExpectedConditions.stalenessOf(advTypeOptionList.get(0)));
        break;
      }
    }

    WebElement advSizeSelect = advBody.findElement(By.cssSelector(CSS_SELECTOR_ADV_SIZE_SELECT));
    advSizeSelect.click();
    wait.until(ExpectedConditions.visibilityOf(advSizeOptionList.get(0)));
    for (WebElement we : advSizeOptionList) {
      String optionText = we.findElement(By.tagName("span")).getText();
      if (campaignAdv.getSize().equals(optionText)) {
        we.click();
        wait.until(ExpectedConditions.stalenessOf(advSizeOptionList.get(0)));
        break;
      }
    }

    String type = campaignAdv.getType();
    if (CampaignAdv.TYPE_HTML.equals(type)) {
      // insert html
      WebElement htmlTextArea = advBody.findElement(By.cssSelector(CSS_SELECTOR_ADV_HTML_TEXTAREA));
      htmlTextArea.sendKeys(campaignAdv.getResource());
//      WebElement saveHtmlButton = advBody.findElement(By.cssSelector(CSS_SELECTOR_ADV_HTML_SAVE_BUTTON));
//      saveHtmlButton.click();
      wait.until(ExpectedConditions.visibilityOf(saveHtml));
      Actions actions = new Actions(driver);
      actions.moveToElement(saveHtml).click().perform();
    } else {
      // upload image
      WebElement fileSelectInput = advBody.findElement(By.cssSelector(CSS_SELECTOR_ADV_IMAGE_UPLOAD_INPUT));
      fileSelectInput.sendKeys(campaignAdv.getResource());
    }
  }

  public void saveData() {
    wait.until(ExpectedConditions.visibilityOf(saveButton));
    saveButton.click();
  }

  public void saveDataAsDraft() {
    wait.until(ExpectedConditions.visibilityOf(saveAsDraftButton));
    saveAsDraftButton.click();
  }

  public void goBack() {
    wait.until(ExpectedConditions.visibilityOf(backButton));
    backButton.click();
    driver.switchTo().alert().accept();
  }

}
