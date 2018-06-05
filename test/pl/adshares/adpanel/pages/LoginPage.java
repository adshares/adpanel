package pl.adshares.adpanel.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;

public class LoginPage {
  private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

  @FindBy(id = "email")
  private WebElement loginEmail;
  @FindBy(id = "password")
  private WebElement loginPassword;
  @FindBy(css = "[data-test='auth-login-form-submit-button']")
  private WebElement loginButton;
  @FindBy(css = "[data-test='auth-redirect-to-registration']")
  private WebElement registerButton;

  /**
   * Login Page - WebElement Assertions
   */
  @FindBy(xpath = "//img[@class = 'adsh-logo']")
  private WebElement assertLogo;
  @FindBy(xpath = "//*[contains(text(), 'Hello!')]")
  private WebElement helloText;
  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Email required!')]")
  private WebElement emailRequired;
  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Invalid email!')]")
  private WebElement invalidEmail;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Password required')]")
  private WebElement passwordEmptyRequired;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]")
  private WebElement passwordMinimumRequired;


  private WebDriver driver;
  private WebDriverWait wait;

  public LoginPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
  }

  public void loginSignIn(String loginAdService, String passwordAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    loginEmail.sendKeys(loginAdService);
    loginPassword.sendKeys(passwordAdService);
    Assert.assertTrue(loginButton.isEnabled());
    LOGGER.info("Button visibility: ok");
    loginButton.click();
  }

  public void pageLayoutValidation() {
    wait.until(ExpectedConditions.visibilityOf(helloText));
    Assert.assertTrue(helloText.isDisplayed());
    Assert.assertEquals(helloText.getText(), "Hello!");
    LOGGER.info("HeadTitle visibility: ok");
    Assert.assertTrue(assertLogo.isDisplayed());
    LOGGER.info("Logo visibility: ok");
  }

  public void loginRequiredEmailValidation() {
    loginButton.click();
    String emptyEmailInput = emailRequired.getText();
    Assert.assertEquals("Email required!", emptyEmailInput);
    System.out.println("Email required - checked!");
  }

  public void wrongEmailCorrectPassword(String passwordAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    loginEmail.sendKeys("aaa");
    loginPassword.sendKeys(passwordAdService);
    loginButton.click();
    String invalidEmailInput = invalidEmail.getText();
    Assert.assertEquals("Invalid email!", invalidEmailInput);
    System.out.println("Invalid email - checked!");
  }

  public void wrongPasswordCorrectEmail(String loginAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    loginEmail.sendKeys(loginAdService);
    loginPassword.sendKeys("aaa");
    loginButton.click();
    String invalidPasswordMinimumInput = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordMinimumInput);
    System.out.println("Minimum 8 signs required - checked!");
  }

  public void loginInvalidEmailValidation() {
    loginButton.click();
    String invalidEmailInput = invalidEmail.getText();
    Assert.assertEquals("Invalid email!", invalidEmailInput);
    System.out.println("Invalid email - checked!");
  }

  public void loginPasswordValidation() {
    loginButton.click();
    String invalidPasswordInput = passwordEmptyRequired.getText();
    Assert.assertEquals("Password required", invalidPasswordInput);
    System.out.println("Password required - checked!");
    loginPassword.sendKeys("aaa");
    String invalidPasswordMinimumInput = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordMinimumInput);
    System.out.println("Minimum 8 signs required - checked!");
    loginPassword.clear();
    driver.navigate().refresh();
    loginPassword.sendKeys("aaaaaaaa");
    Boolean notPresent = ExpectedConditions.not(ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath("//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]"))).apply(driver);
    Assert.assertTrue(notPresent);
    System.out.println("8 signs: Validation message is not present - checked!");
    loginEmail.sendKeys("test@wp.pl");
    loginButton.click();
  }

  public void goToRegistration() {
    registerButton.click();
  }

}
