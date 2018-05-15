package net.adshares.pages.register;

import net.adshares.pages.LoginPage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.log4testng.Logger;

public class RegisterPage {
  private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

  @FindBy(css = "[data-test='auth-registration-form-email']")
  private WebElement registerEmailAdress;
  @FindBy(css = "[data-test='auth-registration-form-password']")
  private WebElement registerPassword;
  @FindBy(css = "[data-test='auth-registration-form-confirm-password']")
  private WebElement registerPasswordConfirm;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")
  private WebElement registerButton;

  private WebDriver driver;
  private WebDriverWait wait;

  public RegisterPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void createAccount(String loginRegisterAdService, String passwordRegisterAdService){
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    registerEmailAdress.sendKeys(loginRegisterAdService);
    registerPassword.sendKeys(passwordRegisterAdService);
    registerPasswordConfirm.sendKeys(passwordRegisterAdService);
    registerButton.click();


  }

}
