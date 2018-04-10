package adsharesDemo;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;

import java.util.concurrent.TimeUnit;

public class DashboardPopup {
  private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

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
    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    userPopUp.isDisplayed();
    String textAssertion = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
    Assert.assertEquals(textAssertion, "Continue as");
    userPopUpPublisher.click();
    LOGGER.info("User choose publisher dashboard ");
  }

  public void popUpAdvertiser() {
    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    userPopUp.isDisplayed();
      String textAssertion = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
      Assert.assertEquals(textAssertion, "Continue as");
      userPopUpAdvertiser.click();
      LOGGER.info("User choose publisher dashboard");
    wait.until(ExpectedConditions.stalenessOf(driver.findElement(By.className("cdk-overlay-pane"))));
  }




}
