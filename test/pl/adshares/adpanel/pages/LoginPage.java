package pl.adshares.adpanel.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;

import java.util.List;
import java.util.Random;
import java.util.Set;

import static pl.adshares.adpanel.setup.DriverProvider.getWebDriverFile;

public class LoginPage {
  private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

  @FindBy(id = "email")
  private WebElement loginEmail;
  @FindBy(id = "password")
  private WebElement loginPassword;
  @FindBy(id = "newPassword")
  private WebElement loginNewPassword;
  @FindBy(id = "currentPassword")
  private WebElement loginCurrentPassword;
  @FindBy(id = "confirmPassword")
  private WebElement loginConfirmPassword;
  @FindBy(id = "newPasswordConfirm")
  private WebElement loginNewPasswordConfirm;
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

  @FindBy(xpath = "//input[@name='email']/following-sibling::span[contains(text(),'Invalid email!')]")
  private WebElement invalidEmailName;

  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Password required')]")
  private WebElement passwordEmptyRequired;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]")
  private WebElement passwordMinimumRequired;

  @FindBy(css = "[data-test='header-choose-user-menu']")
  private WebElement userMenu;
  @FindBy(css = "[data-test='auth-redirect-to-first-login']")
  private WebElement activationEmailLogIn;
  @FindBy(name = "search")
  private WebElement mailcatcherSearch;
  @FindBy(id = "messages")
  private WebElement mailcatcherMessages;
  @FindBy(xpath = "//*[contains(text(), 'The email has already been taken.')]")
  private WebElement ngStarInserted;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")
  private WebElement authRegistrationButton;
  @FindBy(css = "[class='adsh-icon adsh-icon--small adsh-icon--append choose-user-menu-chevron ng-star-inserted']")
  private WebElement headerChooseUserMenu;
  @FindBy(css = "[data-test='header-choose-user-menu-advertiser']")
  private WebElement headerChooseUserMenuAdvertiser;
  @FindBy(css = "[data-test='header-choose-user-menu-publisher']")
  private WebElement headerChooseUserMenuPublisher;

  @FindBy(css = "[class='adsh-icon adsh-icon--small adsh-icon--append settings-menu-chevron']")
  private WebElement settingsMenuChevron;
  @FindBy(css = "[data-test='header-account-settings-button']")
  private WebElement accountSettings;
  @FindBy(css = "[data-test='settings-change-email-form-submit']")
  private WebElement changeEmail;
  @FindBy(css = "[data-test='settings-change-password-form-submit']")
  private WebElement changePassword;

  @FindBy(xpath = "//span[contains(text(), 'Your email was changed successfully.')]")
  private WebElement loginEmailAssert;
  @FindBy(xpath = "//span[contains(text(), 'Password changed')]")
  private WebElement loginPasswordAssert;
  @FindBy(css = "[data-test='auth-redirect-to-first-login']")
  private WebElement firstLogin;
  @FindBy(xpath = "//h2[contains(text(),'Activation Email')]")
  private WebElement ActivationEmail;
  @FindBy(css = "[class='checkbox-label']")
  private WebElement rememberMe;


  private WebElement userMenuAdvertiser;

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

  public void loginInvalidEmailValidation()  {
    loginButton.click();
    String invalidEmailInput = passwordEmptyRequired.getText();
    Assert.assertEquals("Password required", invalidEmailInput);
    System.out.println("Invalid Password required - checked!");
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

  public void goToLoginChangingTheDashboardBack() {
    System.out.println("1. Dashboar Publisher");
    wait.until(ExpectedConditions.visibilityOf(headerChooseUserMenu));
    headerChooseUserMenu.click();
    headerChooseUserMenuAdvertiser.click();
    System.out.println("2. Dashboar Advertiser");
    wait.until(ExpectedConditions.visibilityOf(headerChooseUserMenu));
    headerChooseUserMenu.click();
    headerChooseUserMenuPublisher.click();
    System.out.println("3. Dashboar Publisher Back");
    }

  public void goToLoginRegistration() {
    //                    TEST EMAIL email.email
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerButton.click();
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    String invalidPasswordInput = passwordEmptyRequired.getText();
    Assert.assertEquals("Password required", invalidPasswordInput);
    loginEmail.sendKeys("user");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    wait.until(ExpectedConditions.visibilityOf(invalidEmail));
    String invalidEmailInput = invalidEmail.getText();
    Assert.assertEquals("Invalid email!", invalidEmailInput);
    System.out.println("1. EMAIL INCORRECT");
    //                    TEST EMAIL email@email
    //loginEmail.sendKeys("email@email");
    //wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    //authRegistrationButton.click();
    //wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    //String invalidEmailInput2 = invalidEmailName.getText();
    //Assert.assertEquals("Invalid email!", invalidEmailInput2);
    //System.out.println("Invalid email! - checked!");
    //                    TEST EMAIL CORRECT = PASSWORD INCORRECT
    loginEmail.sendKeys("@e11.click");
    loginPassword.sendKeys("useruse");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    wait.until(ExpectedConditions.visibilityOf(passwordMinimumRequired));
    String invalidPasswordInput2 = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordInput2);
    System.out.println("2. EMAIL CORRECT - PASSWORD INCORRECT");
    //                    TEST EMAIL, PASSWORD CORRECT = CONFIRM PASSWORD INCORRECT
    loginPassword.sendKeys("r");
    loginConfirmPassword.sendKeys("useruse");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    //wait.until(ExpectedConditions.visibilityOf(confirmPasswordMinimumRequired));
    //String invalidPasswordInput3 = confirmPasswordMinimumRequired.getText();
    //Assert.assertEquals("Passwords don't match!", invalidPasswordInput3);
    System.out.println("3. EMAIL, PASSWORD CORRECT - CONFIRM PASSWORD INCORRECT");
    //                    TEST EMAIL, PASSWORD, CONFIRM PASSWORD CORRECT
    loginConfirmPassword.sendKeys("r");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    System.out.println("4. EMAIL, PASSWORD, CONFIRM PASSWORD CORRECT");
    //                    5. TEST EMAIL, PASSWORD, CONFIRM PASSWORD CORRECT
    wait.until(ExpectedConditions.visibilityOf(ngStarInserted));
    String invalidPasswordInput4 = ngStarInserted.getText();
    Assert.assertEquals("The email has already been taken.", invalidPasswordInput4);
    System.out.println("5. The email has already been taken.");
  }

  public void goToLoginRegistrRandom() throws InterruptedException {
    //                    Registr Random
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerButton.click();
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    Random random = new Random();
    int number = random.nextInt(1000000);
    String randoms = String.format("%06d", number);
    loginEmail.sendKeys(randoms+"@e11.click");
    loginPassword.sendKeys("12345678");
    loginConfirmPassword.sendKeys("12345678");
    System.out.println("LoginEmail: "+randoms+"@e11.click");
    System.out.println("Password: "+"12345678");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    System.out.println("1. RegistrRandom - OK");
    //                    Milcatcher Random
    wait = new WebDriverWait(driver, 10);
    driver.get("http://mailcatcher.ads/");
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(mailcatcherMessages));
    Thread.sleep(4000);

    // 1.1 ZMIANA OKNA W CHROME - before clicking on the link
    String handle = driver.getWindowHandle();
    System.out.println ("1. "+driver.getTitle()+" - "+handle);

    mailcatcherMessages.click();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
    Thread.sleep(1000);
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
    System.out.println("2. Mailcatcher - OK");
    Thread.sleep(5000);

    // 1.2 ZMIANA OKNA W CHROME - Store and Print the name of all the windows open
    Set handles = driver.getWindowHandles();
    for (String handle1:driver.getWindowHandles()) {
      System.out.println("2. "+handle1);
      driver.switchTo().window(handle1);
    }
    System.out.println("3. "+driver.getTitle());
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);

    wait.until(ExpectedConditions.visibilityOf(ActivationEmail));
    wait.until(ExpectedConditions.visibilityOf(firstLogin));
    firstLogin.click();
    wait.until(ExpectedConditions.visibilityOf(loginButton));
    loginEmail.sendKeys(randoms+"@e11.click");
    loginPassword.sendKeys("12345678");
    //loginButton.click();
    //System.out.println("3. Log in - OK");
  }


  public void logIn () throws InterruptedException {
    Thread.sleep(10000);
    loginButton.click();
    System.out.println("3. Log in - OK");
  }
  public void logInRememberMe () throws InterruptedException {
    rememberMe.click();
    Thread.sleep(10000);
    loginButton.click();
    System.out.println("3. Log in - OK");
  }

  public void gotologinChangeEmail() {
    wait.until(ExpectedConditions.visibilityOf(settingsMenuChevron));
    settingsMenuChevron.click();
    wait.until(ExpectedConditions.visibilityOf(accountSettings));
    accountSettings.click();
    wait.until(ExpectedConditions.visibilityOf(loginEmail));
    Random random = new Random();
    int number = random.nextInt(1000000);
    String randoms = String.format("%06d", number);
    loginEmail.sendKeys(randoms+"@e11.click");
    changeEmail.click();
    wait.until(ExpectedConditions.visibilityOf(loginEmailAssert));
    String loginEmailAssertInput = loginEmailAssert.getText();
    Assert.assertEquals("Your email was changed successfully.", loginEmailAssertInput);
    System.out.println("-. Your email was changed successfully. - OK");
  }

  public void gotologinChangePassword() {
    wait.until(ExpectedConditions.visibilityOf(settingsMenuChevron));
    settingsMenuChevron.click();
    accountSettings.click();
    wait.until(ExpectedConditions.visibilityOf(loginCurrentPassword));
    loginCurrentPassword.sendKeys("12345678");
    Random random = new Random();
    int number = random.nextInt(100000000);
    String randoms = String.format("%08d", number);
    loginNewPassword.sendKeys(randoms);
    loginNewPasswordConfirm.sendKeys(randoms);
    changePassword.click();
    wait.until(ExpectedConditions.visibilityOf(loginPasswordAssert));
    String loginEmailAssertInput = loginPasswordAssert.getText();
    Assert.assertEquals("Password changed", loginEmailAssertInput);
    System.out.println("-. Password changed - OK");
  }

  public void loginSecondTab() {
    System.out.println ("1. "+driver.getTitle());
    // 1.1 before clicking on the link
    String handle = driver.getWindowHandle();
    System.out.println ("1. "+driver.getTitle()+" - "+handle);

    driver.close();

    // 1.2 Store and Print the name of all the windows open
    Set handles = driver.getWindowHandles();
    for (String handle1:driver.getWindowHandles()) {
      System.out.println("2. "+handle1);
      driver.switchTo().window(handle1);
    }
    System.out.println("3. "+driver.getTitle());
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
//    driver.navigate().to("http://panel.ads/");
    driver.get("http://panel.ads/");
    System.out.println ("4. "+driver.getTitle());
  }

  public void loginSecondTab2() {
    wait.until(ExpectedConditions.visibilityOf(helloText));
    String loginEmailAssertInput = helloText.getText();
    Assert.assertEquals("Hello!", loginEmailAssertInput);
    System.out.println("-. Hello! - OK");
  }
  public void loginSecondTab3() throws InterruptedException {

    driver.get("http://panel.ads/");

    //wait.until(ExpectedConditions.visibilityOf(helloText));
    //String loginEmailAssertInput = helloText.getText();
    //Assert.assertEquals("Hello!", loginEmailAssertInput);
    System.out.println("-. Hello! - OK");
    Thread.sleep(10000);
    // TODO: 13.07.18  loginSecondTab3
  }
  public void loginSecondTab4() throws InterruptedException {

    System.setProperty("webdriver.chrome.driver", getWebDriverFile("chromedriver").getAbsolutePath());
    OperaOptions operaOptions = new OperaOptions();
    operaOptions.addArguments("--start-maximized");
    driver = new OperaDriver(operaOptions);
    driver.get("http://panel.ads");
//    WebDriver driver = new OperaDriver();
//    driver.get("http://panel.ads/");
    //wait.until(ExpectedConditions.visibilityOf(helloText));
    //String loginEmailAssertInput = helloText.getText();
    //Assert.assertEquals("Hello!", loginEmailAssertInput);
    System.out.println("-. Hello! - OK");
    Thread.sleep(10000);

  }

  }
