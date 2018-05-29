package pl.adshares.adpanel;

import pl.adshares.adpanel.enums.Properties;
import pl.adshares.adpanel.pages.admin.AdminMainPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import pl.adshares.adpanel.tools.Structure;
import pl.adshares.adpanel.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class AdminTestCase extends BrowserTestCase {


  private pl.adshares.adpanel.pages.LoginPage loginPage;
  private pl.adshares.adpanel.pages.DashboardPopup dashboardPopup;
  private AdminMainPage adminMainPage;
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
  public void setYourEarningTest(){
    adminMainPage = new AdminMainPage(driver);
    adminMainPage.goToSetEarningPopUp();
    adminMainPage.setEarnings();
  }


}
