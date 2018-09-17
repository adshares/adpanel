package pl.adshares.adpanel.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;
import pl.adshares.adpanel.tools.RandomPage;

import java.util.Set;

//import static com.sun.deploy.uitoolkit.impl.awt.AWTClientPrintHelper.print;

public class RegisterPage {
  private static final Logger LOGGER = Logger.getLogger(RegisterPage.class);

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



  private WebDriver driver;
  private WebDriverWait wait;
  private Object LoginPage;


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

  public void registerForgotPassword(Object user_email, String newPassword) throws InterruptedException {
    int id = (int) RandomPage.getFromId("id");
    wait.until(ExpectedConditions.visibilityOf(forgotPassword));
    forgotPassword.click();
    System.out.println(id+". Forgot Password - OK"); id=id+1;

    wait.until(ExpectedConditions.visibilityOf(emailAddress));
    emailAddress.sendKeys((CharSequence) user_email);
    //String handle = driver.getWindowHandle();
    sendLinkToResetPassword.click();
    Set handles = driver.getWindowHandles();
    int I=2;
    for (String handle1:driver.getWindowHandles()) {
      if(I == 2){
        driver.switchTo().window(handle1);
      }
      I=I+1;
    }
    String handle1 = driver.getWindowHandle();
    System.out.println("-. "+driver.getTitle()+" - "+handle1);
    //                    Mailcatcher
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(mailcatcherMessages));
    Thread.sleep(4000);
    mailcatcherMessages.click();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
    Thread.sleep(1000);
    // 1.1 before clicking on the link
    String handle2 = driver.getWindowHandle();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
    Thread.sleep(5000);
    // 1.2 Store and Print the name of all the windows open
    Set handles3 = driver.getWindowHandles();
    for (String handle3:driver.getWindowHandles()) {
      driver.switchTo().window(handle3);
      I=I+1;
    }
    String handle3 = driver.getWindowHandle();
    System.out.println("-. "+driver.getTitle()+" - "+handle3);
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
    System.out.println(id+". Reset Password"); id=id+1;
    wait.until(ExpectedConditions.visibilityOf(yourNewPasswordIsSet));
    yourNewPasswordIsSet.click();
    wait.until(ExpectedConditions.visibilityOf(email));
    email.sendKeys((CharSequence) user_email);
    wait.until(ExpectedConditions.visibilityOf(password));
    password.sendKeys(newPassword);
    wait.until(ExpectedConditions.visibilityOf(email));
    email.getText();
    wait.until(ExpectedConditions.visibilityOf(password));
    password.getText();
    wait.until(ExpectedConditions.visibilityOf(logIn));
    logIn.click();
    wait.until(ExpectedConditions.visibilityOf(adshLogo));
    System.out.println(id+". New password: "+newPassword); id=id+1;
    System.out.println("Koniec");
    RandomPage.createId();
    RandomPage.id("id", id);
  }

}
