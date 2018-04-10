package adsharesDemo.publisher;

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

  /**
   * Dashboard Assertions
   */


  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherNewSite(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 1000);
    PageFactory.initElements(driver, this);
  }

  public void sitePublisherBasicInfo() {
    wait.until(ExpectedConditions.visibilityOf(websiteUrl));
    websiteUrl.sendKeys("https://google.pl");
//    new Select(contentLanguage).selectByValue("english");
    contentLanguage.click();
    contentLanguageEnglish.click();
  }

}
