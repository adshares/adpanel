package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class PublisherNewSite {
  @FindBy(css = "[data-test='publisher-edit-site-basic-information-form-url']")   private WebElement websiteUrl;
  @FindBy(xpath = "//div[@class ='mat-select-trigger']")                          private WebElement contentLanguage;
  @FindBy(xpath = "//span[contains(text(), 'polish')]")                           private WebElement contentLanguagePolish;
  @FindBy(xpath = "//span[contains(text(), 'english')]")                          private WebElement contentLanguageEnglish;
  @FindBy(css = "[data-test='publisher-edit-site-save-and-continue']")            private WebElement saveButtonPublisherCampaign;
  @FindBy(css = "[data-test='publisher-navigate-to-dashboard']")                  private WebElement backButtonPublisherCampaign;
  @FindBy(css = "[class='error-msg ng-star-inserted']")                           private WebElement AssertionErrorMsgNgStarInserted;
  @FindBy(xpath = "//span[contains(text(), 'Please provide a valid URL.')]")      private WebElement AssertionPleaseProvideAValidURL;
  @FindBy(css = "[data-test='publisher-navigate-to-dashboard']")                  private WebElement backToDashboard;
  @FindBy(xpath = "//*[contains(text(), 'Website name')]")                                                              private WebElement AssertWebsiteName;
  @FindBy(xpath = "//*[contains(text(), 'Content Language')]")                                                          private WebElement AssertContentLanguage;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'My Sites')]")                                                                  private WebElement AssertMySites;

  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherNewSite(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 100);
    PageFactory.initElements(driver, this);
  }

  public void basicInformation(String Url) {
    System.out.println("---------- publisherBasicInformation ----------");
    wait.until(ExpectedConditions.visibilityOf(websiteUrl));
    websiteUrl.clear();
    websiteUrl.sendKeys(Url);
    System.out.println("Url: "+Url);
    contentLanguage.click();
    wait.until(ExpectedConditions.visibilityOf(contentLanguageEnglish));
    contentLanguageEnglish.click();
    Assert.assertEquals("Website name", AssertWebsiteName.getText());
    System.out.println("Assert - "+AssertWebsiteName.getText());
    Assert.assertEquals("Content Language", AssertContentLanguage.getText());
    System.out.println("Assert - "+AssertContentLanguage.getText());
  }
  public void basicInformationSaveContinue() {
    System.out.println("---------- basicInformationSaveContinue ----------");
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
    System.out.println("Click - saveButtonPublisherCampaign");
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    Assert.assertEquals("1. Requires", AssertAdditionalTargeting1.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting1.getText());
    Assert.assertEquals("2. Excludes", AssertAdditionalTargeting2.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting2.getText());
  }
  public void basicInformationBackToDashboard() {
    System.out.println("---------- basicInformationBackToDashboard ----------");
    wait.until(ExpectedConditions.visibilityOf(backButtonPublisherCampaign));
    backButtonPublisherCampaign.click();
    System.out.println("Click - backButtonPublisherCampaign");
    Alert alert = driver.switchTo().alert();
    alert.accept();
    wait.until(ExpectedConditions.visibilityOf(AssertMySites));
    Assert.assertEquals("My Sites", AssertMySites.getText());
    System.out.println("Assert - "+AssertMySites.getText());
  }
  public void basicInformationError(String website_name_or_url)  {
    System.out.println("---------- publisherBasicInformationError ----------");
    wait.until(ExpectedConditions.visibilityOf(websiteUrl));
    websiteUrl.clear();
    websiteUrl.sendKeys(website_name_or_url);
    System.out.println("website_name_or_url: "+website_name_or_url);
    contentLanguage.click();
    wait.until(ExpectedConditions.visibilityOf(contentLanguageEnglish));
    contentLanguageEnglish.click();
    wait.until(ExpectedConditions.visibilityOf(saveButtonPublisherCampaign));
    saveButtonPublisherCampaign.click();
    System.out.println("Click - saveButtonPublisherCampaign");
    wait.until(ExpectedConditions.visibilityOf(AssertionErrorMsgNgStarInserted));
    Assert.assertEquals("Please provide a valid URL.", AssertionPleaseProvideAValidURL.getText());
    System.out.println("Assert - "+AssertionPleaseProvideAValidURL.getText());
  }
}
