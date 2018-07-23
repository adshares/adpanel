package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.net.UrlChecker;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PublisherEditSite {
  @FindBy(css = "[data-test='publisher-site-url']")
  private WebElement websiteUrl;
  @FindBy(css = "[data-status='publisher-site-status']")
  private WebElement editButtonPublisher;
  @FindBy(css = "[data-test='publisher-site-edit']")
  private WebElement editButtonPublisherBasicInformation;

  @FindBy(css = "[data-test='publisher-edit-site-summary-navigate-to-basic-information']")
  private WebElement publisherEditBasicInformation;
  @FindBy(css = "[data-test='publisher-edit-site-basic-information-form-url']")
  private WebElement publisherEditBasicInformationFormUrl;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")
  private WebElement publisherEditBasicInformationSaveAndContinue;

  @FindBy(css = "[data-test='publisher-edit-site-summary-navigate-to-additional-information']")
  private WebElement publisherEditAdditionalInformation;


  /**
   * Publisher form Assertions
   */

  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherEditSite(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void sitePublisherBasicInfo(String Url) throws InterruptedException {
    wait.until(ExpectedConditions.visibilityOf(editButtonPublisherBasicInformation));
    editButtonPublisherBasicInformation.click();
    wait.until(ExpectedConditions.visibilityOf(publisherEditBasicInformation));
    publisherEditBasicInformation.click();
    System.out.println("Edit Basic Information");
    wait.until(ExpectedConditions.visibilityOf(publisherEditBasicInformation));
    publisherEditBasicInformation.click();
    publisherEditBasicInformationFormUrl.sendKeys(Url);
    publisherEditBasicInformationFormUrl.getText();
    publisherEditBasicInformationSaveAndContinue.click();
    System.out.println("Edit Additional Information");
    wait.until(ExpectedConditions.visibilityOf(publisherEditAdditionalInformation));
    publisherEditAdditionalInformation.click();
  }

}
