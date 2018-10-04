package pl.adshares.adpanel.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.log4testng.Logger;
import pl.adshares.adpanel.tools.Maps;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.List;
import java.util.Random;
import java.util.Set;

import static pl.adshares.adpanel.setup.DriverProvider.getWebDriverFile;

public class LoginPage {
  private static final Logger LOGGER = Logger.getLogger(LoginPage.class);

  @FindBy(id = "email")                                                                                                 private WebElement loginEmail;
  @FindBy(id = "password")                                                                                              private WebElement loginPassword;
  @FindBy(id = "newPassword")                                                                                           private WebElement loginNewPassword;
  @FindBy(id = "currentPassword")                                                                                       private WebElement loginCurrentPassword;
  @FindBy(id = "confirmPassword")                                                                                       private WebElement loginConfirmPassword;
  @FindBy(id = "newPasswordConfirm")                                                                                    private WebElement loginNewPasswordConfirm;
  @FindBy(id = "messages")                                                                                              private WebElement mailcatcherMessages;
  @FindBy(css = "//*[@class='button button-blue']")                                                                         private WebElement mailcatcherButton;


  @FindBy(name = "search")                                                                                              private WebElement mailcatcherSearch;

  @FindBy(css = "[data-test='auth-redirect-to-registration']")                                                          private WebElement registerButton;
  @FindBy(css = "[data-test='header-choose-user-menu']")                                                                private WebElement userMenu;
  @FindBy(css = "[data-test='auth-redirect-to-first-login']")                                                           private WebElement activationEmailLogIn;
  @FindBy(css = "[data-test='auth-registration-form-submit-button']")                                                   private WebElement authRegistrationButton;
  @FindBy(css = "[class='adsh-icon adsh-icon--small adsh-icon--append choose-user-menu-chevron ng-star-inserted']")     private WebElement headerChooseUserMenu;
  @FindBy(css = "[data-test='header-choose-user-menu-advertiser']")                                                     private WebElement headerChooseUserMenuAdvertiser;
  @FindBy(css = "[data-test='header-choose-user-menu-publisher']")                                                      private WebElement headerChooseUserMenuPublisher;
//  @FindBy(xpath = "//*[@class='adsh-icon adsh-icon--small adsh-icon--append settings-menu-chevron']")                   private WebElement settingsMenuChevron;


  @FindBy(xpath = "//*[@data-test='header-toggle-settings-menu']//img[2]")                                                          private WebElement settingsMenu;
  @FindBy(xpath = "//*[@class='adsh-icon adsh-icon--small adsh-icon--append settings-menu-chevron']")                   private WebElement settingsMenuChevron;
  @FindBy(css = "[data-test='header-log-out-button']")                                                                  private WebElement settingsLogOut;
  @FindBy(css = "[data-test='header-account-settings-button']")                                                         private WebElement accountSettings;
  @FindBy(css = "[data-test='header-billing-payments-button']")                                                         private WebElement billingPayments;
  @FindBy(css = "[data-test='settings-change-email-form-submit']")                                                      private WebElement changeEmail;
  @FindBy(css = "[data-test='settings-change-password-form-submit']")                                                   private WebElement changePassword;
  @FindBy(css = "[data-test='auth-redirect-to-first-login']")                                                           private WebElement firstLogin;
  @FindBy(css = "[class='checkbox-label']")                                                                             private WebElement rememberMe;
  @FindBy(css = "[data-test='settings-faq-link']")                                                                      private WebElement CheckOurFAQ;
  @FindBy(css = "[class='logo-header']")                                                                                private WebElement FAQ;
  @FindBy(css = "[class='adsh-logo']")                                                                                  private WebElement adshLogo;
  @FindBy(css = "[data-test='header-dashboard-link']")                                                                  private WebElement headerDashboardLink;
  @FindBy(css = "[class='adsh-dialog-close']")                                                                    private WebElement adshDialogClose;

  @FindBy(xpath = "//*[@class='cdk-overlay-container']//descendant::mat-dialog-container[1]//descendant::div[1]")       private WebElement adshDialogClose1;
  @FindBy(xpath = "//*[@class='cdk-overlay-container']//descendant::mat-dialog-container[2]//descendant::div[1]")       private WebElement adshDialogClose2;
  @FindBy(xpath = "//*[@class='cdk-overlay-container']//descendant::mat-dialog-container[3]//descendant::div[1]")       private WebElement adshDialogClose3;
  @FindBy(xpath = "//*[@class='cdk-overlay-container']//descendant::mat-dialog-container[4]//descendant::div[1]")       private WebElement adshDialogClose4;
  @FindBy(xpath = "//*[contains(text(),'Log In')]")                                                                     private WebElement loginButton;
  @FindBy(xpath = "//h2[contains(text(),'Activation Email')]")                                                          private WebElement ActivationEmail;
  @FindBy(xpath = "//span[contains(text(), 'Email required!')]")                                                        private WebElement loginEmailAssert2;
  @FindBy(xpath = "//span[contains(text(), 'Invalid email!')]")                                                         private WebElement loginEmailAssert3;
  @FindBy(xpath = "//*[contains(text(), 'The email must be a valid email address.')]")                                  private WebElement loginEmailAssert4;
  @FindBy(xpath = "//img[@class = 'adsh-logo']")                                                                        private WebElement assertLogo;
  @FindBy(xpath = "//*[contains(text(), 'Hello!')]")                                                                    private WebElement helloText;
  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Email required!')]")                   private WebElement emailRequired;
  @FindBy(xpath = "//input[@id='email']/following-sibling::span[contains(text(),'Invalid email!')]")                    private WebElement invalidEmail;
  @FindBy(xpath = "//input[@name='email']/following-sibling::span[contains(text(),'Invalid email!')]")                  private WebElement invalidEmailName;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Password required')]")              private WebElement passwordEmptyRequired;
  @FindBy(xpath = "//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]")      private WebElement passwordMinimumRequired;
  @FindBy(xpath = "//*[contains(text(), 'The email has already been taken.')]")                                         private WebElement ngStarInserted;
  @FindBy(xpath = "//*[contains(text(), 'Changing email is a 2 step process')]")                                        private WebElement loginEmailAssert;
  @FindBy(xpath = "//*[contains(text(), 'Request Failed')]")                                                            private WebElement loginEmailAssert1;
  @FindBy(xpath = "//*[contains(text(), 'Password changed')]")                                                          private WebElement loginPasswordAssert;
  @FindBy(xpath = "//span[contains(text(), 'Minimum 8 signs required!')]")                                              private WebElement loginPasswordAssert2;
  @FindBy(xpath = "//span[contains(text(), 'Passwords don't match!')]")                                                 private WebElement loginPasswordAssert3;
  @FindBy(xpath = "//span[contains(text(), 'Old password is not valid')]")                                              private WebElement loginPasswordAssert4;
  @FindBy(xpath = "//h1[contains(text(), 'Email activation complete')]")                                                private WebElement adshDialogCloseAssert;
  @FindBy(xpath = "//*[contains(text(), 'Invalid email!')]")                                                            private WebElement AssertLoginSignInError1;
  @FindBy(xpath = "//*[contains(text(), 'Minimum 8 signs required!')]")                                                 private WebElement AssertLoginSignInError2;
  @FindBy(xpath = "//*[contains(text(), 'Password or email is invalid.')]")                                             private WebElement passwordOrEmailIsInvalid;

  private WebElement userMenuAdvertiser;

  private WebDriver driver;
  private WebDriverWait wait;
  private Mailcatcher mailcatcher;
  private LoginPage loginPage;

  public LoginPage(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
  }

  public void adshDialogClose() {
    System.out.println("---------- adshDialogClose ----------");
    wait.until(ExpectedConditions.visibilityOf(adshDialogClose));
    adshDialogClose.click();
    Assert.assertEquals(adshDialogClose.getText(), "Hello!");
    System.out.println("KONIEC - adshDialogClose");
  }
  public void loginSignIn(String login, String password) {
    int id = (int) Maps.getId("id");
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    loginEmail.sendKeys(login);
    loginPassword.sendKeys(password);
    Assert.assertTrue(loginButton.isEnabled());
    LOGGER.info("Button visibility: ok");
    wait.until(ExpectedConditions.visibilityOf(loginButton));
    loginButton.click();
    wait.until(ExpectedConditions.visibilityOf(adshLogo));
    wait.until(ExpectedConditions.visibilityOf(headerDashboardLink));
    System.out.println(id+". Log In  - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
  }

  public void loginSignInError() {
    wait.until(ExpectedConditions.visibilityOf(AssertLoginSignInError1));
    Assert.assertEquals("Invalid email!", AssertLoginSignInError1.getText());
    int id = 1;
    System.out.println(id+". Invalid email! - OK"); id=id+1;
    Assert.assertEquals("Minimum 8 signs required!", AssertLoginSignInError2.getText());
    System.out.println(id+". Minimum 8 signs required! - OK"); id=id+1;
    Maps.createId();
    Maps.id("id", id);
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
    System.out.println("1z5. Email required - checked!");
  }

  public void wrongEmailCorrectPassword(String passwordAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    loginEmail.sendKeys("aaa");
    loginPassword.sendKeys(passwordAdService);
    loginButton.click();
    String invalidEmailInput = invalidEmail.getText();
    Assert.assertEquals("Invalid email!", invalidEmailInput);
    System.out.println("1z2. Invalid email - checked!");
  }

  public void wrongPasswordCorrectEmail(String loginAdService) {
    wait.until(ExpectedConditions.titleIs(driver.getTitle()));
    loginEmail.sendKeys(loginAdService);
    loginPassword.sendKeys("aaa");
    loginButton.click();
    String invalidPasswordMinimumInput = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordMinimumInput);
    System.out.println("2z2. Minimum 8 signs required - checked!");
  }

  public void loginInvalidEmailValidation()  {
    loginButton.click();
    String invalidEmailInput = passwordEmptyRequired.getText();
    Assert.assertEquals("Password required", invalidEmailInput);
    System.out.println("2z5. Invalid Password required - checked!");
  }

  public void loginPasswordValidation() {
    loginButton.click();
    String invalidPasswordInput = passwordEmptyRequired.getText();
    Assert.assertEquals("Password required", invalidPasswordInput);
    System.out.println("3z5. Password required - checked!");
    loginPassword.sendKeys("aaa");
    String invalidPasswordMinimumInput = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordMinimumInput);
    System.out.println("4z5. Minimum 8 signs required - checked!");
    loginPassword.clear();
    driver.navigate().refresh();
    loginPassword.sendKeys("aaaaaaaa");
    Boolean notPresent = ExpectedConditions.not(ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath("//input[@id='password']/following-sibling::span[contains(text(),'Minimum 8 signs required!')]"))).apply(driver);
    Assert.assertTrue(notPresent);
    System.out.println("5z5. 8 signs: Validation message is not present - checked!");
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
    System.out.println("1/5. EMAIL INCORRECT");
    //                    TEST EMAIL CORRECT = PASSWORD INCORRECT
    loginEmail.sendKeys("@e11.click");
    loginPassword.sendKeys("useruse");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    wait.until(ExpectedConditions.visibilityOf(passwordMinimumRequired));
    String invalidPasswordInput2 = passwordMinimumRequired.getText();
    Assert.assertEquals("Minimum 8 signs required!", invalidPasswordInput2);
    System.out.println("2/5. EMAIL CORRECT - PASSWORD INCORRECT");
    //                    TEST EMAIL, PASSWORD CORRECT = CONFIRM PASSWORD INCORRECT
    loginPassword.sendKeys("r");
    loginConfirmPassword.sendKeys("useruse");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    System.out.println("3/5. EMAIL, PASSWORD CORRECT - CONFIRM PASSWORD INCORRECT");
    //                    TEST EMAIL, PASSWORD, CONFIRM PASSWORD CORRECT
    loginConfirmPassword.sendKeys("r");
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    System.out.println("4/5. EMAIL, PASSWORD, CONFIRM PASSWORD CORRECT");
    //                    5. TEST EMAIL, PASSWORD, CONFIRM PASSWORD CORRECT
    wait.until(ExpectedConditions.visibilityOf(ngStarInserted));
    String invalidPasswordInput4 = ngStarInserted.getText();
    Assert.assertEquals("The email has already been taken.", invalidPasswordInput4);
    System.out.println("5/5. The email has already been taken.");
  }

//  LOG IN RANDOM
  public void RandomEmail(String Password) throws InterruptedException {
    RandomEmail_Email(Password);
//    Thread.sleep(1000);
    mailcatcher = new Mailcatcher(driver);
    mailcatcher.mailcatcherEmail();
//    RandomEmail_Mailcatcher();
    LogInRandom_LogIn();
  }
  private void RandomEmail_Email(String Password) {
    System.out.println("---------- RandomEmail_Email ----------");
    System.out.println(driver.getCurrentUrl());
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerButton.click();
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    Random random = new Random();
    int number = random.nextInt(1000000);
    String randomsEmail = String.format("%06d", number)+"@e11.click";
    Maps.create();
    Maps.email("email", randomsEmail);
    Maps.password("password", Password);
    Maps.createId();
    Maps.id("id",1);
    loginEmail.sendKeys(randomsEmail);
    loginEmail.getText();
    loginPassword.sendKeys(Password);
    loginPassword.getText();
    loginConfirmPassword.sendKeys(Password);
    loginConfirmPassword.getText();
    System.out.println("LoginEmail: "+ Maps.getEmail("email"));
    System.out.println("Password:   "+ Maps.getPassword("password"));
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
  }

  // TODO: 04.10.18 delete 
  public void RandomEmail_Mailcatcher() throws InterruptedException {
    System.out.println("---------- Mailcatcher ----------");
    driver.get(Maps.get_url_mailcatcher("url_mailcatcher"));
    System.out.println(driver.getCurrentUrl());
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(mailcatcherMessages));
    Thread.sleep(4000);
    // 1.1 ZMIANA OKNA W CHROME - before clicking on the link
    String handle = driver.getWindowHandle();
    mailcatcherMessages.click();
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.ARROW_UP, Keys.ARROW_UP);
    Thread.sleep(1000);
    driver.findElement(By.cssSelector("[class='mailcatcher js ']")).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.ENTER);
//    Thread.sleep(4500);
    driver.close();
  }

  private void LogInRandom_LogIn() {
    System.out.println("---------- adshDialogClose.click ----------");
// 1.2 ZMIANA OKNA W CHROME - Store and Print the name of all the windows open
//    Set handles = driver.getWindowHandles();
    for (String handle1:driver.getWindowHandles()) {
      driver.switchTo().window(handle1);
    }
    String url=driver.getCurrentUrl();
    System.out.println(url);
    PageFactory.initElements(driver, this);

    wait.until(ExpectedConditions.visibilityOf(adshDialogCloseAssert));
    adshDialogClose.click();
  }

  public void UserEmail(String Email, String Password) throws InterruptedException {
    Maps.create();
    Maps.email("email", Email);
    Maps.password("password", Password);
    logIn();
  }
  public void AdminEmail(String Email, String Password) throws InterruptedException {
    Maps.create();
    Maps.email("email", Email);
    Maps.password("password", Password);
    logIn();
//
  }
//  LOG IN
  public void logIn () throws InterruptedException {
    System.out.println("---------- logIn ----------");
    wait.until(ExpectedConditions.visibilityOf(loginEmail));
    loginEmail.sendKeys((CharSequence) Maps.getEmail("email"));
    loginEmail.getText();
    wait.until(ExpectedConditions.visibilityOf(loginPassword));
    loginPassword.sendKeys((CharSequence) Maps.getPassword("password"));
    loginPassword.getText();
    wait.until(ExpectedConditions.visibilityOf(loginButton));
    loginEmail.getText();
    loginPassword.getText();
    System.out.println("LoginEmail: "+Maps.getEmail("email"));
    System.out.println("Password:   "+Maps.getPassword("password"));
    loginButton.click();
    System.out.println(driver.getCurrentUrl());

    if(!driver.findElements(By.xpath("//*[contains(text(), 'Password or email is invalid.')]")).isEmpty()){
      RegisterEmail();
      RandomEmail_Mailcatcher();
      LogInRandom_LogIn();
    }else{
      System.out.println("Skip >>>>> RegisterEmail");
    }
  }
  private void RegisterEmail() {
    System.out.println("---------- RegisterEmail ----------");
    System.out.println(driver.getCurrentUrl());
    wait.until(ExpectedConditions.visibilityOf(registerButton));
    registerButton.click();
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
    loginEmail.sendKeys(Maps.getEmail("email"));
    loginEmail.getText();
    loginPassword.sendKeys(Maps.getPassword("password"));
    loginPassword.getText();
    loginConfirmPassword.sendKeys(Maps.getPassword("password"));
    loginConfirmPassword.getText();
    System.out.println("LoginEmail: "+ Maps.getEmail("email"));
    System.out.println("Password:   "+ Maps.getPassword("password"));
    wait.until(ExpectedConditions.visibilityOf(authRegistrationButton));
    authRegistrationButton.click();
  }

  public void logInRememberMe () throws InterruptedException {
    System.out.println("---------- logInRememberMe ----------");
    System.out.println(driver.getCurrentUrl());
    System.out.println("JavascriptExecutor");
    JavascriptExecutor js =(JavascriptExecutor)driver;
    js.executeScript("arguments[0].click();", rememberMe);
    logIn();
  }

  public void gotologinChangeEmail(String ChangeEmail, String ChangeEmail2) throws InterruptedException {
    int id = (int) Maps.getId("id");
    wait.until(ExpectedConditions.visibilityOf(adshLogo));
    wait.until(ExpectedConditions.visibilityOf(settingsMenuChevron));
    Thread.sleep(1000);
    settingsMenuChevron.click();
    wait.until(ExpectedConditions.visibilityOf(accountSettings));
    accountSettings.click();
    wait.until(ExpectedConditions.visibilityOf(loginEmail));
    loginEmail.sendKeys(ChangeEmail);
    changeEmail.click();
    wait.until(ExpectedConditions.visibilityOf(loginEmailAssert));
    Assert.assertEquals("Changing email is a 2 step process", loginEmailAssert.getText());
    System.out.println(id+". Changing email is a 2 step process - OK    "+ChangeEmail); id=id+1;
    wait.until(ExpectedConditions.visibilityOf(adshDialogClose));
    adshDialogClose.click();

    loginEmail.sendKeys(ChangeEmail2);
    changeEmail.click();
    wait.until(ExpectedConditions.visibilityOf(loginEmailAssert1));
    Assert.assertEquals("Request Failed", loginEmailAssert1.getText());
    System.out.println(id+". Request Failed - OK                        "+ChangeEmail2); id=id+1;
    wait.until(ExpectedConditions.visibilityOf(adshDialogClose));
    adshDialogClose.click();
    loginEmail.clear();
    Maps.create();
    Maps.email("email",ChangeEmail);
    System.out.println("NewLoginEmail: "+ChangeEmail);
    Maps.createId();
    Maps.id("id", id);
  }

  public void gotologinChangeEmailNegative() {
    wait.until(ExpectedConditions.visibilityOf(settingsMenuChevron));
    settingsMenuChevron.click();
    wait.until(ExpectedConditions.visibilityOf(accountSettings));
    accountSettings.click();
//    "Email required!"
    wait.until(ExpectedConditions.visibilityOf(changeEmail));
    changeEmail.click();
    wait.until(ExpectedConditions.visibilityOf(loginEmailAssert2));
    String loginEmailAssertInput = loginEmailAssert2.getText();
    Assert.assertEquals("Email required!", loginEmailAssertInput);
    System.out.println("1z10. Email required! - OK");
//    "Invalid email!"
    int I=2;
    String[] myList = {"michał@ę11.click","michal@-e11.click","michal@e11.","@e11.click","michal@_e11.click","michal.e11.click"};
    for (String List : myList){
      wait.until(ExpectedConditions.visibilityOf(loginEmail));
      loginEmail.sendKeys(List);
      changeEmail.click();
      wait.until(ExpectedConditions.visibilityOf(loginEmailAssert3));
      Assert.assertEquals("Invalid email!", loginEmailAssert3.getText());
      System.out.println(I+"z10. Invalid email! - OK    [ "+List+" ]");
      loginEmail.clear();
      I=I+1;
    }
    String[] myList2 = {"michal@e11","-michal@e11.click","_michal@e11.click"};
    for (String List2 : myList2){
      wait.until(ExpectedConditions.visibilityOf(loginEmail));
      loginEmail.sendKeys(List2);
      changeEmail.click();
      wait.until(ExpectedConditions.visibilityOf(loginEmailAssert4));
      Assert.assertEquals("The email must be a valid email address.", loginEmailAssert4.getText());
      System.out.println(I+"z10. The email must be a valid email address. - OK    [ "+List2+" ]");
      loginEmail.clear();
    }
  }

  public void gotologinChangePassword() throws InterruptedException {
    wait.until(ExpectedConditions.visibilityOf(settingsMenu));
    Thread.sleep(1000);
    settingsMenu.click();
    wait.until(ExpectedConditions.visibilityOf(accountSettings));
    accountSettings.click();
//    wait.until(ExpectedConditions.elementToBeClickable(settingsMenuChevron));
//    JavascriptExecutor js =(JavascriptExecutor)driver;
//    js.executeScript("arguments[0].click();", settingsMenuChevron);
//    JavascriptExecutor js2 =(JavascriptExecutor)driver;
//    js2.executeScript("arguments[0].click();", accountSettings);
    wait.until(ExpectedConditions.visibilityOf(loginCurrentPassword));
    loginCurrentPassword.sendKeys(Maps.getPassword("password"));
    Random random = new Random();
    int number = random.nextInt(100000000);
    String NewPassword = String.format("%08d", number);
    Maps.password("password", NewPassword);
    wait.until(ExpectedConditions.visibilityOf(loginNewPassword));
    loginNewPassword.sendKeys(NewPassword);
    wait.until(ExpectedConditions.visibilityOf(loginNewPasswordConfirm));
    loginNewPasswordConfirm.sendKeys(NewPassword);
    wait.until(ExpectedConditions.visibilityOf(changePassword));
    changePassword.click();
    wait.until(ExpectedConditions.visibilityOf(loginPasswordAssert));
    String loginEmailAssertInput = loginPasswordAssert.getText();
    Assert.assertEquals("Password changed", loginEmailAssertInput);
    System.out.println("-. Password changed - OK");
    wait.until(ExpectedConditions.visibilityOf(adshDialogClose));
    adshDialogClose.click();
  }
  public void gotologinChangePasswordNegative() {
    wait.until(ExpectedConditions.visibilityOf(settingsMenuChevron));
    settingsMenuChevron.click();
    accountSettings.click();
    wait.until(ExpectedConditions.visibilityOf(loginCurrentPassword));
      loginCurrentPassword.sendKeys("12345678");
      loginNewPassword.sendKeys("134679");
      loginNewPasswordConfirm.sendKeys("134679");
      changePassword.click();
      wait.until(ExpectedConditions.visibilityOf(loginPasswordAssert2));
      Assert.assertEquals("Minimum 8 signs required!", loginPasswordAssert2.getText());
      System.out.println("1z3. Minimum 8 signs required! - OK");
      loginCurrentPassword.clear();
        loginNewPassword.clear();
        loginNewPasswordConfirm.clear();
        loginCurrentPassword.sendKeys("123456789");
        loginNewPassword.sendKeys("13467913");
        loginNewPasswordConfirm.sendKeys("13467931");
        changePassword.click();
        System.out.println("2z3. Passwords don't match! - OK");
          loginCurrentPassword.clear();
          loginNewPassword.clear();
          loginNewPasswordConfirm.clear();
          loginCurrentPassword.sendKeys("123456789");
          loginNewPassword.sendKeys("87654321");
          loginNewPasswordConfirm.sendKeys("87654321");
          System.out.println("3z3. Old password is not valid - OK");
  }
  public void gotologinFAQ() throws InterruptedException {
    wait.until(ExpectedConditions.visibilityOf(settingsMenuChevron));
    settingsMenuChevron.click();
    wait.until(ExpectedConditions.visibilityOf(billingPayments));
    billingPayments.click();
    wait.until(ExpectedConditions.visibilityOf(CheckOurFAQ));
//    Zmiana zakładki
    String handle = driver.getWindowHandle();
    System.out.println ("-. "+driver.getTitle()+" (1) - "+handle);
    Thread.sleep(20000);
    CheckOurFAQ.click();
//    Zmiana zakładki
    Set handles = driver.getWindowHandles();
    int I=2;
    for (String handle1:driver.getWindowHandles()) {
      System.out.println("-."+I+". "+handle1+"");
      driver.switchTo().window(handle1);
      I=I+1;
    }
    String handle2 = driver.getWindowHandle();
    System.out.println("5."+I+". "+driver.getTitle()+" - "+handle2);
    wait = new WebDriverWait(driver, 30);
    PageFactory.initElements(driver, this);
    wait.until(ExpectedConditions.visibilityOf(FAQ));
  }

  private void CONTROL_T() throws AWTException {
    Robot robo = new Robot();
    robo.keyPress(KeyEvent.VK_CONTROL);
    robo.keyPress(KeyEvent.VK_T);
    robo.keyRelease(KeyEvent.VK_CONTROL);
    robo.keyRelease(KeyEvent.VK_T);
  }

  public void loginSecondTab() {
    System.out.println(driver.getTitle() + " (1) - " + driver.getWindowHandle());
    try {
      CONTROL_T();
    } catch (AWTException e) {
      e.printStackTrace();
    }
    driver.close();
    try {
      Thread.sleep(5000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    for (String handle1:driver.getWindowHandles()) {
      driver.switchTo().window(handle1);
    }
    PageFactory.initElements(driver, this);
    driver.get(Maps.get_url_panel("url_panel"));
    System.out.println(driver.getTitle() + " (2) - " + driver.getWindowHandle());
  }

  public void loginSecondTab2() {
    wait.until(ExpectedConditions.visibilityOf(helloText));
    Assert.assertEquals("Hello!", helloText.getText());
    System.out.println("Assert - Hello!");
  }
  public void loginSecondTab3() throws InterruptedException {
    Thread.sleep(1000);
    wait.until(ExpectedConditions.visibilityOf(adshLogo));
    System.out.println(driver.getCurrentUrl());
    adshLogo.click();
    for (String handle1:driver.getWindowHandles()) {
      driver.switchTo().window(handle1);
    }
    System.out.println(driver.getCurrentUrl());
    wait = new WebDriverWait(driver, 10);
    PageFactory.initElements(driver, this);
    driver.get(Maps.get_url_panel("url_panel"));
    wait.until(ExpectedConditions.visibilityOf(adshLogo));
    System.out.println(driver.getCurrentUrl());
  }
  public void loginSecondTab4() throws InterruptedException {
    System.setProperty("webdriver.opera.driver", getWebDriverFile("operadriver").getAbsolutePath());
    OperaOptions operaOptions = new OperaOptions();
    operaOptions.addArguments("--start-maximized");
    driver = new OperaDriver(operaOptions);
    driver.get(Maps.get_url_panel("url_panel"));
    System.out.println("-. Hello! - OK");
    Thread.sleep(10000);
  }

  public void logInFail(String email, String password) {
    System.out.println("---------- logInFail ----------");
    wait.until(ExpectedConditions.visibilityOf(loginEmail));
    loginEmail.sendKeys(email);
    loginEmail.getText();
    wait.until(ExpectedConditions.visibilityOf(loginPassword));
    loginPassword.sendKeys(password);
    loginPassword.getText();
    wait.until(ExpectedConditions.visibilityOf(loginButton));
    loginButton.click();
    System.out.println(driver.getCurrentUrl());
    wait.until(ExpectedConditions.visibilityOf(passwordOrEmailIsInvalid));
    Assert.assertEquals("Password or email is invalid.", passwordOrEmailIsInvalid.getText());
    System.out.println("1/1. Password or email is invalid.");
  }
}
