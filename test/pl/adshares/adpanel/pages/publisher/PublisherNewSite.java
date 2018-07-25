package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PublisherNewSite {
  @FindBy(css = "[data-test='publisher-edit-site-basic-information-form-url']")
  private WebElement websiteUrl;
  @FindBy(xpath = "//div[@class ='mat-select-trigger']")
  private WebElement contentLanguage;
  @FindBy(xpath = "//span[contains(text(), 'english')]")
  private WebElement contentLanguageEnglish;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")
  private WebElement saveButtonPublisherCampaign;
  @FindBy(css = "[data-test='publisher-navigate-to-dashboard']")
  private WebElement backButtonPublisherCampaign;
  /**
   * Publisher form Assertions
   */


  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherNewSite(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 100);
    PageFactory.initElements(driver, this);
  }

  public void sitePublisherBasicInfo(String Url) {
    wait.until(ExpectedConditions.visibilityOf(websiteUrl));
    websiteUrl.sendKeys(Url);
    websiteUrl.getText();
    contentLanguage.click();
    wait.until(ExpectedConditions.visibilityOf(contentLanguageEnglish));
    contentLanguageEnglish.click();
    saveButtonPublisherCampaign.click();
    System.out.println("5. BasicInfo - OK");
  }

}
