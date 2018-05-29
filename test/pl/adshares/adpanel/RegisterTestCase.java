package pl.adshares.adpanel;

import pl.adshares.adpanel.enums.Properties;
import pl.adshares.adpanel.pages.register.RegisterConfirmation;
import pl.adshares.adpanel.pages.register.RegisterPage;
import pl.adshares.adpanel.setup.BrowserTestCase;
import pl.adshares.adpanel.tools.Structure;
import pl.adshares.adpanel.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class RegisterTestCase extends BrowserTestCase {

  private RegisterPage registerPage;
  private RegisterConfirmation registerConfirmation;
  protected String loginAdService;
  protected String passwordAdService;


  @BeforeTest
  public void setUp() {

    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.PASSWORD);
  }

  @Test
  public void createAccount() {
    registerPage = new RegisterPage(driver);
    registerPage.createAccount(loginAdService, passwordAdService);
    registerConfirmation =new RegisterConfirmation(driver);
    registerConfirmation.registerConfirmation();
  }

  @Test
  public void registerPageObjectValidation() {
    registerPage = new RegisterPage(driver);
    registerPage.registerRequiredEmailValidation();
    registerPage.registerInvalidEmailValidation();
    registerPage.registerPasswordValidation();
    System.out.println("<-- Login Page Validation passed -->");
  }

}
