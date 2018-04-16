package net.adshares.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PublisherNewSite {
  @FindBy(id = "siteUrl")
  private WebElement websiteUrl;
  @FindBy(xpath = "//div[@class ='mat-select-trigger']")
  private WebElement contentLanguage;
  @FindBy(xpath = "//span[contains(text(), 'english')]")
  private WebElement contentLanguageEnglish;
  @FindBy(xpath = "//span[starts-with(text(), 'Save & Continue')]")
  private WebElement saveButtonPublisherCampaign;
  @FindBy(xpath = "//button[contains(text(), 'Back to Dashboard')]")
  private WebElement backButtonPublisherCampaign;
  /**
   * Publisher form Assertions
   */


  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherNewSite(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 1000);
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
  }

}
