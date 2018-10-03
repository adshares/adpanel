package pl.adshares.adpanel;

import pl.adshares.adpanel.enums.Properties;
import pl.adshares.adpanel.pages.*;
import pl.adshares.adpanel.pages.RegisterPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import pl.adshares.adpanel.tools.Maps;
import pl.adshares.adpanel.tools.Structure;
import pl.adshares.adpanel.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.Random;

public class AdPanel extends BrowserTestCase {

  private String url_panel = "http://localhost:8102/";
  private String url_mailhog = "http://localhost:8025/";
  private String url_mailcatcher = "http://mailcatcher.ads/";
  private String user = "user@e11.click";
  private String admin = "admin@e11.click";
  private String password = "12345678";

  private RegisterPage registerPage;
  private LoginPage loginPage;
  private DashboardPopup dashboardPopup;
  private HeaderBarPage headerBarPage;
  private Mailcatcher mailcatcher;
  private String loginAdService;
  private String passwordAdService;
  private String randomsEmail;

  public AdPanel() {
  }

  @BeforeTest
  public void setUp() {
    Maps.url();
    Maps.url_panel("url_panel", url_panel);
    Maps.url_mailcatcher("url_mailcatcher", url_mailcatcher);
    Maps.url_mailhog("url_mailhog", url_mailhog);

    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.PASSWORD);
  }

  @Test
  public void logInPopUpFirstPublisher() {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstPublisher();
  }
  @Test
  public void logInPopUpFirstAdvertiser(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstAdvertiser();
  }
  @Test
  public void logInPopUpFirstAdvertiserPublisher(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstAdvertiserPublisher();
  }
  @Test
  public void logInPopUpPublisher(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
  }
    @Test
  public void loginPopUpAdvertiser(){
      dashboardPopup = new DashboardPopup(driver);
      dashboardPopup.popUpAdvertiser();
  }
  @Test
  public void firstLogInPopUp() {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.chooseAccountTypeAllTypes();
  }
  @Test
  private void logInRandomEmail() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.RandomEmail(password);
    loginPage.logIn();
  }
//  private void loginUserEmail() throws InterruptedException {
//    loginPage = new LoginPage(driver);
//    loginPage.UserEmail(password);
//    loginPage.logIn();
//  }



  @Test
  public void logInRandomEmailRememberMe() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.RandomEmail(password);
    loginPage.logInRememberMe();
  }
  @Test
  public void logInUserEmail() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.UserEmail(user,password);
    loginPage.logIn();
  }
  @Test
  public void logInUserEmailRememberMe() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.UserEmail(user,password);
    loginPage.logInRememberMe();
  }

  @Test
  public void logInChangingTheDashboardBack() {
    loginPage = new LoginPage(driver);
    loginPage.goToLoginChangingTheDashboardBack();
  }

  @Test
  public void logInChangeEmailNegative()  {
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmailNegative();
  }

  @Test
  public void logInChangePasswordNegative() {
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangePasswordNegative();
  }

  @Test
  public void logInFAQ() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.gotologinFAQ();
  }

  @Test
  public void logOut() {
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
  }


  //TEST
  @Test
  public void logIn_Mailcatcher() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.RandomEmail("12345678");
  }


  @Test
  public void Registration_RandomEmail() throws InterruptedException {
    System.out.println("---------- TS_1 - TC_1 ----------");
    logInRandomEmail();
  }
  @Test
  public void Registration_Error() {
    System.out.println("---------- TS_1 - TC_2 ----------");
    loginPage = new LoginPage(driver);
    loginPage.goToLoginRegistration();
  }
  @Test
  public void Registration_ForgotPassword() {
    System.out.println("---------- TS_1 - TC_3 ----------");
    registerPage = new RegisterPage(driver);
    registerPage.registerForgotPassword(Maps.getEmail("email"),"ADS11ads");
  }
  @Test
  public void logInPageObjectValidation() {
    System.out.println("---------- TS_2 - TC_1 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginRequiredEmailValidation();
    loginPage.loginInvalidEmailValidation();
    loginPage.loginPasswordValidation();
  }
  @Test
  public void logInPageCrossAccessValidation() {
    System.out.println("---------- TS_2 - TC_2 ----------");
    loginPage = new LoginPage(driver);
    loginPage.wrongEmailCorrectPassword(passwordAdService);
    driver.navigate().refresh();
    loginPage.wrongPasswordCorrectEmail(loginAdService);
  }
  @Test
  public void logInWithRolePublisher() {
    System.out.println("---------- TS_2 - TC_3 ----------");
  }
  @Test
  public void logInWithRoleAdvertiser() {
    System.out.println("---------- TS_2 - TC_4 ----------");
  }
  @Test
  public void logInWithRoleAdvertiserPublisher() {
    System.out.println("---------- TS_2 - TC_5 ----------");
  }
  @Test
  public void logInChangeEmail_1() throws InterruptedException, AWTException {
    System.out.println("---------- TS_2 - TC_6.1 ----------");
    loginPage = new LoginPage(driver);
    Random random = new Random();
    int number = random.nextInt(1000000);
    String s = String.format("%06d", number)+"e";
    Thread.sleep(1000);
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("michal@"+s+".click", "test@"+s+".click");
    System.out.println("1z7 - OK");
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    System.out.println("2z7 - logOut");
    mailcatcher = new Mailcatcher(driver);
    mailcatcher.mailcatcherEmail();
    System.out.println("3z7 - Mailcatcher");
// TODO: 27.09.18 TC_6.1 Error - notifications, count, sites ?XDEBUG_SESSION_START=PHPSTORM
    Robot robo = new Robot();
    robo.keyPress(KeyEvent.VK_CONTROL);
    robo.keyPress(KeyEvent.VK_SHIFT);
    robo.keyPress(KeyEvent.VK_I);
    robo.keyRelease(KeyEvent.VK_CONTROL);
    robo.keyRelease(KeyEvent.VK_SHIFT);
    robo.keyRelease(KeyEvent.VK_I);

    Thread.sleep(10000);
    loginPage = new LoginPage(driver);
    loginPage.adshDialogClose();
    System.out.println("4z8 - logOut");
    headerBarPage.logOut();
    System.out.println("5z7 - logOut");
    loginPage.RandomEmail_Mailcatcher();
    System.out.println("6z7 - Mailcatcher");
//    loginPage.logIn();
    loginPage.loginSignIn("michal@"+s+".click", "12345678");
    System.out.println("7z7 - loginSignIn");
    headerBarPage.logOut();
    System.out.println("8z7 - logOut");
  }
  @Test
  public void logInChangeEmail_2() {
    System.out.println("---------- TS_2 - TC_6.2 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("michal.michal@e11.click", "test@e11.click");
  }
  @Test
  public void loginChangeEmail_3() {
    System.out.println("---------- TS_2 - TC_6.3 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("michal@e11.click.pl", "test@e11.click");
  }
  @Test
  public void logInChangeEmail_4() {
    System.out.println("---------- TS_2 - TC_6.4 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("MiChAl@e11.click", "test@e11.click");
  }
  @Test
  public void logInChangeEmail_5() {
    System.out.println("---------- TS_2 - TC_6.5 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("michal123@e11.click", "test@e11.click");
  }
  @Test
  public void logInChangeEmail_6() {
    System.out.println("---------- TS_2 - TC_6.6 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("michal_123@e11.click", "test@e11.click");
  }
  @Test
  public void logInChangeEmail_7() {
    System.out.println("---------- TS_2 - TC_6.7 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail("111michal@e11.click", "test@e11.click");
  }
  @Test
  public void logInChangePassword() {
    System.out.println("---------- TS_2 - TC_7 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangePassword();
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage.pageLayoutValidation();
    loginPage.loginSignIn(Maps.getEmail("email"), Maps.getPassword("password"));
    System.out.println("LoginEmail:  "+ Maps.getEmail("email"));
    System.out.println("NewPassword: "+ Maps.getPassword("password"));
  }
  @Test
  public void logOutTest() {
    System.out.println("---------- TS_2 - TC_8 ----------");
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
  }
  @Test
  public void logInSecondTab() {
    System.out.println("---------- TS_2 - TC_9 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab();
  }
  @Test
  public void logInSecondTab2() {
    // TODO: 27.09.18 TC_10 Error - remember me do not work
    System.out.println("---------- TS_2 TC_10 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab();
    loginPage.loginSecondTab2();
  }
  @Test
  public void logInSessionHoles() throws InterruptedException {
    System.out.println("---------- TS_2 - TC_11 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab3();
  }
  @Test
  public void logInSecondTab4() throws InterruptedException {
    // TODO: 27.09.18 TC_12 Error - session expiration not work - setting in file
    System.out.println("---------- TS_2 - TC_12 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab4();
  }
  @Test
  // TODO: 27.09.18 TC_13 Error - admin account in the database
  public void logInAdminEmail() throws InterruptedException {
    System.out.println("---------- TS_2 - TC_13 ----------");
    loginPage = new LoginPage(driver);
    loginPage.AdminEmail(admin,password);
  }
}
