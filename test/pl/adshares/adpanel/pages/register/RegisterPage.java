package pl.adshares.adpanel.pages.register;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;

import java.util.Set;

//import static com.sun.deploy.uitoolkit.impl.awt.AWTClientPrintHelper.print;

public class RegisterPage {
  private static final Logger LOGGER = Logger.getLogger(RegisterPage.class);

  @FindBy(css = "[data-test='auth-registration-form-email']")
  private WebElement registerEmailAddress;
  @FindBy(css = "[data-test='auth-registration-form-password']")
  private WebElement registerPassword;
  @FindBy(css = "[data-test='auth-registration-form-confirm-password']")
  private WebElement registerPasswordConfirm;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")
  private WebElement registerButton;

  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Email required!')]")
  private WebElement emailRequired;
  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Invalid email!')]")
  private WebElement invalidEmail;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Password required')]")
  private WebElement passwordEmptyRequired;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]")
  private WebElement passwordMinimumRequired;
  @FindBy(xpath = "//input[@id='confirmPassword']/following-sibling::span[contains(text(),'Passwords don')]")
  private WebElement passwordDontMatch;

  @FindBy(css = "[data-test='auth-redirect-to-remind-password']")
  private WebElement forgotPassword;
  @FindBy(css = "[data-test='auth-remind-password-form-email']")
  private WebElement emailAddress;
  @FindBy(css = "[class='ng-star-inserted']")
  private WebElement sendNewPassword;
  @FindBy(css = "[data-test='auth-remind-password-form-submit-button']")
  private WebElement sendLinkToResetPassword;
  @FindBy(id = "messages")
  private WebElement mailcatcherMessages;
  @FindBy(id = "password")
  private WebElement password;
  @FindBy(id = "confirmPassword")
  private WebElement confirmPassword;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")
  private WebElement resetPassword;





  private WebDriver driver;
  private WebDriverWait wait;

  public RegisterPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 10);
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

  public void registerForgotPassword() throws InterruptedException {
    int I=1;
    wait.until(ExpectedConditions.visibilityOf(forgotPassword));
    forgotPassword.click();
    wait.until(ExpectedConditions.visibilityOf(sendLinkToResetPassword));
    emailAddress.sendKeys("user@e11.click");
    sendLinkToResetPassword.click();
    //                    Mailcatcher
    wait = new WebDriverWait(driver, 10);
    driver.get("http://mailcatcher.ads/");
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(mailcatcherMessages));
    Thread.sleep(4000);
    mailcatcherMessages.click();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
    Thread.sleep(1000);

    // 1.1 before clicking on the link
    String handle = driver.getWindowHandle();
    System.out.println (I+". "+driver.getTitle()+" - "+handle);
    I=I+1;
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
    Thread.sleep(5000);

    // 1.2 Store and Print the name of all the windows open
    Set handles = driver.getWindowHandles();
    for (String handle1:driver.getWindowHandles()) {
      System.out.println(I+". "+handle1);
      driver.switchTo().window(handle1);
      I=I+1;
    }
    String handle2 = driver.getWindowHandle();
    System.out.println(I+". "+driver.getTitle()+" - "+handle2);

    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(password));
    password.sendKeys("useruser");
    confirmPassword.sendKeys("useruser");
    resetPassword.click();
    //driver.quit();

  }


}
