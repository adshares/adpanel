package pl.adshares.adpanel.setup;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeClass;

public abstract class BrowserTestCase {

  public WebDriver driver;

  @BeforeClass
  public void getDriver() {
    driver = DriverProvider.getWebDriver();
  }

  @AfterTest
  public void tearDown() {
//    DriverProvider.close();
  }
}
