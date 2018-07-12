package pl.adshares.adpanel.pages.register;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RegisterConfirmation {

  @FindBy(css = "[data-test='auth-redirect-to-first-login']")
  private WebElement logInButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public RegisterConfirmation(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void registerConfirmation(){
    wait.until(ExpectedConditions.visibilityOf(logInButton));
    logInButton.isDisplayed();
  }

  public void succesRegistrationGoToLoginPage(){
    wait.until(ExpectedConditions.visibilityOf(logInButton));
    logInButton.click();
  }


}
