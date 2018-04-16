package net.adshares.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;

public class DashboardPopup {
  private static final Logger LOGGER = Logger.getLogger(DashboardPopup.class);

  @FindBy(css = "#mat-dialog-0 > app-account-choose-dialog > mat-dialog-content > h6")
  private WebElement userPopUp;
  @FindBy(xpath = "//mat-dialog-content[@class = 'mat-dialog-content']/div[2]/button")
  private WebElement userPopUpPublisher;
  @FindBy(xpath = "//mat-dialog-content[@class = 'mat-dialog-content']/div[1]/button")
  private WebElement userPopUpAdvertiser;


  private WebDriver driver;
  private WebDriverWait wait;

  public DashboardPopup(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 20);
    PageFactory.initElements(driver, this);
  }

  public void popUpPublisher() {
    try {
      wait.until(ExpectedConditions.visibilityOf(userPopUp));
      String textAssertion = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
      Assert.assertEquals(textAssertion, "Continue as");
      userPopUpPublisher.click();
      wait.until(ExpectedConditions.stalenessOf(driver.findElement(By.className("cdk-overlay-pane"))));
    } catch (TimeoutException te) {
      LOGGER.info("No popup displayed");
    } finally {
      LOGGER.info("User choose publisher dashboard ");
    }
  }

  public void popUpAdvertiser() {
    try {
      wait.until(ExpectedConditions.visibilityOf(userPopUp));
      String textAssertion = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
      Assert.assertEquals(textAssertion, "Continue as");
      userPopUpAdvertiser.click();
      wait.until(ExpectedConditions.stalenessOf(driver.findElement(By.className("cdk-overlay-pane"))));
    } catch (TimeoutException te) {
      LOGGER.info("No popup displayed");
    } finally {
      LOGGER.info("User choose advertiser dashboard ");
    }
  }
}
