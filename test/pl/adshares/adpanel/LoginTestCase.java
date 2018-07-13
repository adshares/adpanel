package pl.adshares.adpanel;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import pl.adshares.adpanel.enums.Properties;
import pl.adshares.adpanel.pages.DashboardPopup;
import pl.adshares.adpanel.pages.HeaderBarPage;
import pl.adshares.adpanel.pages.LoginPage;
import pl.adshares.adpanel.pages.Mailcatcher;
import pl.adshares.adpanel.setup.BrowserTestCase;
import pl.adshares.adpanel.tools.Structure;
import pl.adshares.adpanel.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class LoginTestCase extends BrowserTestCase {

  private LoginPage loginPage;
  private Mailcatcher mailcatcher;
  private DashboardPopup dashboardPopup;
  private HeaderBarPage headerBarPage;
  private String loginAdService;
  private String passwordAdService;

  @BeforeTest
  public void setUp() {

    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.PASSWORD);
  }

  @Test
  public void loginTest() {
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
    loginPage.loginSignIn(loginAdService, passwordAdService);
    System.out.println("loginTest");
  }

  @Test
  public void loginPopUpFirstPublisher() throws InterruptedException {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstPublisher();
  }
  @Test
  public void loginPopUpFirstAdvertiser(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstAdvertiser();
  }

  @Test
  public void loginPopUpPublisher(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
  }
    @Test
  public void loginPopUpAdvertiser(){
      dashboardPopup = new DashboardPopup(driver);
      dashboardPopup.popUpAdvertiser();
  }


  @Test
  public void firstLoginPopUp() {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.chooseAccountTypeAllTypes();
  }

  @Test
  public void loginPageObjectValidation() {
    loginPage = new LoginPage(driver);
    loginPage.loginRequiredEmailValidation();
    loginPage.loginInvalidEmailValidation();
    loginPage.loginPasswordValidation();
    System.out.println("<-- Login Page Validation passed -->");
  }

  @Test
  public void loginPageCrossAccessValidation() {
    loginPage = new LoginPage(driver);
    loginPage.wrongEmailCorrectPassword(passwordAdService);
    System.out.println("<-- Login Page: wrong Email & Correct Password scenerio passed -->");
    driver.navigate().refresh();
    loginPage.wrongPasswordCorrectEmail(loginAdService);
    System.out.println("<-- Login Page: Correct Email & wrong Password scenerio passed -->");
  }

  @Test
  public void loginRegisterError() {
    loginPage = new LoginPage(driver);
    loginPage.goToLoginRegistration();
  }

  @Test
  public void loginRegisterRandom() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.goToLoginRegistrRandom();
    loginPage .logIn();
  }

  @Test
  public void loginRegisterRememberMe() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.goToLoginRegistrRandom();
    loginPage .logInRememberMe();
  }

  @Test
  public void logOutTest() {
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
    System.out.println("logOutTest");
  }

  @Test
  public void loginChangingTheDashboardBack() {
    loginPage = new LoginPage(driver);
    loginPage.goToLoginChangingTheDashboardBack();
  }

  @Test
    public void loginChangeEmail() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail();
  }
  @Test
  public void loginChangePassword() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangePassword();
  }
  @Test
  public void logOut() {
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
    System.out.println("logOutTest");
  }
  @Test
  public void loginSecondTab() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab();
  }
  @Test
  public void loginSecondTab2() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab();
    loginPage.loginSecondTab2();
  }
  @Test
  public void loginSecondTab3() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab3();
  }
  @Test
  public void loginSecondTab4() throws InterruptedException {
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab4();
  }

}
