package net.adshares.pages.publisher;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


public class SiteSummary {

  @FindBy(xpath = "//button[contains(text(), 'Publish site')]")
  private WebElement publishSiteButton;
  @FindBy(css = "div.col-xs-12.site-edit-summary__info-cell.site-info--primary")
  private WebElement basicInformationComparing;

  private WebDriver driver;
  private WebDriverWait wait;

  public SiteSummary(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 1000);
    PageFactory.initElements(driver, this);
  }

  public void summaryCheck() {
//    Assert.assertEquals(websiteUrl,basicInformationComparing);
  }

  public void publishNewSite() {
    wait.until(ExpectedConditions.visibilityOf(publishSiteButton));
    publishSiteButton.click();
  }


}
