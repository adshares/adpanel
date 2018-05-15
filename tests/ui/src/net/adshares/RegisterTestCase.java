package net.adshares;

import net.adshares.enums.Properties;
import net.adshares.pages.register.RegisterConfirmation;
import net.adshares.pages.register.RegisterPage;
import net.adshares.setup.BrowserTestCase;
import net.adshares.tools.Structure;
import net.adshares.tools.Xml;
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


}
