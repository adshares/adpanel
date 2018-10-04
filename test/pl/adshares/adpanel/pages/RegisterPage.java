package pl.adshares.adpanel.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class RegisterPage {

  @FindBy(css = "[data-test='auth-registration-form-email']")                                                           private WebElement registerEmailAddress;
  @FindBy(css = "[data-test='auth-registration-form-password']")                                                        private WebElement registerPassword;
  @FindBy(css = "[data-test='auth-registration-form-confirm-password']")                                                private WebElement registerPasswordConfirm;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")                                                   private WebElement registerButton;

  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Email required!')]")                   private WebElement emailRequired;
  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Invalid email!')]")                    private WebElement invalidEmail;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Password required')]")              private WebElement passwordEmptyRequired;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]")      private WebElement passwordMinimumRequired;
  @FindBy(xpath = "//input[@id='confirmPassword']/following-sibling::span[contains(text(),'Passwords don')]")           private WebElement passwordDontMatch;

  @FindBy(css = "[data-test='auth-redirect-to-forgotten-password']")                                                    private WebElement forgotPassword;
  @FindBy(css = "[data-test='auth-remind-password-form-email']")                                                        private WebElement emailAddress;
  @FindBy(css = "[class='ng-star-inserted']")                                                                           private WebElement sendNewPassword;
  @FindBy(css = "[data-test='auth-remind-password-form-submit-button']")                                                private WebElement sendLinkToResetPassword;
  @FindBy(id = "messages")                                                                                              private WebElement mailcatcherMessages;
  @FindBy(id = "password")                                                                                              private WebElement password;
  @FindBy(id = "confirmPassword")                                                                                       private WebElement confirmPassword;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")                                                   private WebElement resetPassword;
  @FindBy(xpath = "//*[contains(text(),'Log In')]")                                                                     private WebElement logIn;
  @FindBy(css = "[data-test='auth-login-form-submit-button']")                                                          private WebElement logIn2;
  @FindBy(id = "email")                                                                                                 private WebElement email;
  @FindBy(css = "[class='adsh-logo']")                                                                                  private WebElement adshLogo;
  @FindBy(css = "[class='adsh-dialog-close']")                                                                          private WebElement yourNewPasswordIsSet;

  @FindBy(id = "email")                                                                                                 private WebElement loginEmail;
  @FindBy(id = "password")                                                                                              private WebElement loginPassword;
  @FindBy(xpath = "//*[contains(text(),'Log In')]")                                                                     private WebElement loginButton;

  private WebDriver driver;
  private WebDriverWait wait;
  private Mailcatcher mailcatcher;

  public RegisterPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public void createAccount(String loginRegisterAdService, String passwordRegisterAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    registerEmailAddress.sendKeys(loginRegisterAdService);
    registerPassword.sendKeys(passwordRegisterAdService);
    registerPasswordConfirm.sendKeys(passwordRegisterAdService);
    registerButton.click();
  }

  public void registerRequiredEmailValidation() {
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerButton.click();
    wait.until(ExpectedConditions.visibilityOf(emailRequired));
    String emptyEmailInput = emailRequired.getText();
    Assert.assertEquals("Email required!", emptyEmailInput);
    System.out.println("Email required - checked!");
  }

  public void wrongEmailCorrectPasswordRegister(String passwordAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    registerEmailAddress.sendKeys("aaa");
    registerPassword.sendKeys(passwordAdService);
    registerPasswordConfirm.sendKeys(passwordAdService);
    registerButton.click();
    String invalidEmailInput = invalidEmail.getText();
    Assert.assertEquals("Invalid email!", invalidEmailInput);
    System.out.println("Invalid email - checked!");
  }

  public void wrongPasswordCorrectEmailRegister(String loginAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    registerEmailAddress.sendKeys(loginAdService);
    registerPassword.sendKeys("aaa");
    registerPasswordConfirm.sendKeys("aaa");
    registerButton.click();
    String invalidPasswordMinimumInput = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordMinimumInput);
    System.out.println("Minimum 8 signs required - checked!");
  }

  public void wrongConfirmPasswordCorrectEmailRegister(String loginAdService, String passwordAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    registerEmailAddress.sendKeys(loginAdService);
    registerPassword.sendKeys(passwordAdService);
    registerPasswordConfirm.sendKeys("aaa");
    registerButton.click();
    String invalidPasswordMinimumInput = passwordDontMatch.getText();
    Assert.assertEquals("Passwords don't match!", invalidPasswordMinimumInput);
    System.out.println("Passwords don't match! - checked!");
  }

  public void registerInvalidEmailValidation() {
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerEmailAddress.sendKeys("test");
    registerButton.click();
    wait.until(ExpectedConditions.visibilityOf(invalidEmail));
    String invalidEmailInput = invalidEmail.getText();
    Assert.assertEquals("Invalid email!", invalidEmailInput);
    System.out.println("Invalid email - checked!");
  }

  public void registerPasswordValidation() {
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerButton.click();
    String invalidPasswordInput = passwordEmptyRequired.getText();
    Assert.assertEquals("Password required", invalidPasswordInput);
    System.out.println("Password required - checked!");
    registerPassword.sendKeys("aaa");
    registerPasswordConfirm.click();
    registerButton.click();
    String invalidPasswordDontMatchInput = passwordDontMatch.getText();
    Assert.assertEquals("Passwords don't match!", invalidPasswordDontMatchInput);
    String invalidPasswordMinimumInput = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordMinimumInput);
    System.out.println("Minimum 8 signs required - checked!");
    registerPassword.clear();
    registerPassword.sendKeys("aaaaaaaa");
    registerButton.click();
    Boolean notPresent = ExpectedConditions.not(ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath("//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]"))).apply(driver);
    Assert.assertTrue(notPresent);
    System.out.println("8 signs: Validation message is not present - checked!");
    registerEmailAddress.clear();
    registerEmailAddress.sendKeys("test@wp.pl");
    registerPasswordConfirm.sendKeys("aaaaaaaa");
    registerButton.click();
  }

  public void registerForgotPassword(String Email, String newPassword) throws InterruptedException {
    System.out.println("---------- Forgot Password ----------");
    wait.until(ExpectedConditions.visibilityOf(loginEmail));
    wait.until(ExpectedConditions.visibilityOf(loginPassword));
    wait.until(ExpectedConditions.visibilityOf(loginButton));
    wait.until(ExpectedConditions.visibilityOf(forgotPassword));
    forgotPassword.click();
    System.out.println("Click - Forgot Password");
    wait.until(ExpectedConditions.visibilityOf(emailAddress));
    emailAddress.sendKeys((CharSequence) Email);
    sendLinkToResetPassword.click();

    mailcatcher = new Mailcatcher(driver);
    mailcatcher.mailcatcherEmail();

    System.out.println("---------- Reset Password ----------");
    for (String handle1:driver.getWindowHandles()) {
      driver.switchTo().window(handle1);
    }
    System.out.println(driver.getCurrentUrl());
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(password));
    password.sendKeys(newPassword);
    wait.until(ExpectedConditions.visibilityOf(confirmPassword));
    confirmPassword.sendKeys(newPassword);
    password.getText();
    confirmPassword.getText();
    wait.until(ExpectedConditions.visibilityOf(resetPassword));
    resetPassword.click();
    System.out.println("Click - Reset Password");
    wait.until(ExpectedConditions.visibilityOf(yourNewPasswordIsSet));
    yourNewPasswordIsSet.click();
    wait.until(ExpectedConditions.visibilityOf(email));
    email.sendKeys((CharSequence) Email);
    wait.until(ExpectedConditions.visibilityOf(password));
    password.sendKeys(newPassword);
    wait.until(ExpectedConditions.visibilityOf(email));
    email.getText();
    wait.until(ExpectedConditions.visibilityOf(password));
    password.getText();
    wait.until(ExpectedConditions.visibilityOf(logIn));
    logIn.click();
    wait.until(ExpectedConditions.visibilityOf(adshLogo));
    System.out.println("New password: "+newPassword);
  }

//  public void registerForgotPassword(String email, String ads11ads) {
//  }
}
