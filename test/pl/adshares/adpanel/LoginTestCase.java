package pl.adshares.adpanel;

import pl.adshares.adpanel.enums.Properties;
import pl.adshares.adpanel.pages.HeaderBarPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import pl.adshares.adpanel.tools.Structure;
import pl.adshares.adpanel.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class LoginTestCase extends BrowserTestCase {

  private pl.adshares.adpanel.pages.LoginPage loginPage;
  private pl.adshares.adpanel.pages.DashboardPopup dashboardPopup;
  private HeaderBarPage headerBarPage;
  protected String loginAdService;
  protected String passwordAdService;

  @BeforeTest
  public void setUp() {

    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.PASSWORD);
  }

  @Test
  public void loginTest() {
    loginPage = new pl.adshares.adpanel.pages.LoginPage(driver);
    loginPage.pageLayoutValidation();
    loginPage.loginSignIn(loginAdService, passwordAdService);
    dashboardPopup = new pl.adshares.adpanel.pages.DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
  }

  @Test
  public void loginPageObjectValidation() {
    loginPage = new pl.adshares.adpanel.pages.LoginPage(driver);
    loginPage.loginRequiredEmailValidation();
    loginPage.loginInvalidEmailValidation();
    loginPage.loginPasswordValidation();
    System.out.println("<-- Login Page Validation passed -->");
  }

  @Test
  public void logOutTest() {
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage = new pl.adshares.adpanel.pages.LoginPage(driver);
    loginPage.pageLayoutValidation();
  }

  @Test
  public void registerTest() {
    loginPage = new pl.adshares.adpanel.pages.LoginPage(driver);
    loginPage.pageLayoutValidation();
    loginPage.goToRegistration();
  }

}
