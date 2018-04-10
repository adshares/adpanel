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

public class DesktopPage {
  private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

  @FindBy(css = "#mat-dialog-0 > app-account-choose-dialog > mat-dialog-content > h6")
  private WebElement userPopUp;
  @FindBy(xpath = "//mat-dialog-content[@class = 'mat-dialog-content']/div[2]/button")
  private WebElement userPopUpPublisher;
  @FindBy(xpath = "//mat-dialog-content[@class = 'mat-dialog-content']/div[1]/button")
  private WebElement userPopUpAdvertiser;

  private WebDriver driver;
  private WebDriverWait wait;

  public DesktopPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 20);
    PageFactory.initElements(driver, this);
  }

  public void popUpPublisher() {
    wait.until(ExpectedConditions.visibilityOf(userPopUp));
    if (userPopUp.isEnabled()) {
      String textAssertion = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
      Assert.assertEquals(textAssertion, "Continue as");
      userPopUpPublisher.click();
      LOGGER.info("Użytkownik wybrał panel publishera");
      System.out.println("Użytkownik wybrał panel publishera");
    } else {
      LOGGER.info("Użytkownik posiada jedynie dostęp publishera");
      System.out.println("Użytkownik posiada jedynie dostęp publishera");
    }
  }

  public void popUpAdvertiser() {
    wait.until(ExpectedConditions.visibilityOf(userPopUp));
    if (userPopUp.isEnabled()) {
      String textAssertion = driver.findElement(By.xpath("//*[@id='mat-dialog-0']/app-account-choose-dialog/mat-dialog-content/h6")).getText();
      Assert.assertEquals(textAssertion, "Continue as");
      userPopUpAdvertiser.click();
      LOGGER.info("Użytkownik wybrał panel Advertisera");
      System.out.println("Użytkownik wybrał panel Advertisera");
    } else {
      LOGGER.info("Użytkownik posiada jedynie dostęp Advertisa");
      System.out.println("Użytkownik posiada jedynie dostęp Advertisera");
    }
    wait.until(ExpectedConditions.stalenessOf(driver.findElement(By.className("cdk-overlay-pane"))));
  }

}
