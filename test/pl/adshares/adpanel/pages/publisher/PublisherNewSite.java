package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import pl.adshares.adpanel.tools.RandomPage;

public class PublisherNewSite {
  @FindBy(css = "[data-test='publisher-edit-site-basic-information-form-url']")   private WebElement websiteUrl;
  @FindBy(xpath = "//div[@class ='mat-select-trigger']")                          private WebElement contentLanguage;
  @FindBy(xpath = "//span[contains(text(), 'english')]")                          private WebElement contentLanguageEnglish;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")            private WebElement saveButtonPublisherCampaign;
  @FindBy(css = "[data-test='publisher-navigate-to-dashboard']")                  private WebElement backButtonPublisherCampaign;
  /**
   * Publisher form Assertions
   */
  @FindBy(css = "[class='error-msg ng-star-inserted']")                           private WebElement AssertionErrorMsgNgStarInserted;
  @FindBy(xpath = "//span[contains(text(), 'Please provide a valid URL.')]")      private WebElement AssertionPleaseProvideAValidURL;
  @FindBy(css = "[data-test='publisher-navigate-to-dashboard']")                  private WebElement backToDashboard;


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
    int id = (int) RandomPage.getFromId("id");
    System.out.println(id+". BasicInfo - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void goToSiteAdditionalTargeting() {
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
    int id = (int) RandomPage.getFromId("id");
    System.out.println(id+". BasicInfo - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void sitePublisherBasicInfoError(String Url)  {
    wait.until(ExpectedConditions.visibilityOf(AssertionErrorMsgNgStarInserted));
    Assert.assertEquals("Please provide a valid URL.", AssertionPleaseProvideAValidURL.getText());
    int id = (int) RandomPage.getFromId("id");
    System.out.println(id+". Please provide a valid URL. - OKK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }
  public void backToDashboard() {
    wait.until(ExpectedConditions.visibilityOf(backToDashboard));
    backToDashboard.click();
    Alert alert = driver.switchTo().alert();
    alert.accept();
    int id = (int) RandomPage.getFromId("id");
    System.out.println(id+". Back Basic Information - OK"); id=id+1;
    RandomPage.createId();
    RandomPage.id("id", id);
  }

}
