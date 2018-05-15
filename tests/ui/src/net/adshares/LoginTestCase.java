package net.adshares;

import net.adshares.enums.Properties;
import net.adshares.pages.DashboardPopup;
import net.adshares.pages.LoginPage;
import net.adshares.setup.BrowserTestCase;
import net.adshares.tools.Structure;
import net.adshares.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class LoginTestCase extends BrowserTestCase {

  private LoginPage loginPage;
  private DashboardPopup dashboardPopup;
  protected String loginAdService;
  protected String passwordAdService;

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
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
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
  public void logOutTest() {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.logOut();
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
  }

  @Test
  public void registerTest() {
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
    loginPage.goToRegistration();
  }

}
