package net.adshares.setup;

import net.adshares.enums.Properties;
import net.adshares.pages.DashboardPopup;
import net.adshares.pages.LoginPage;
import net.adshares.pages.publisher.*;
import net.adshares.tools.Structure;
import net.adshares.tools.Xml;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;

public class BrowserTestCase {
  /**
   * System property defining location of ChromeDriver used by Selenium
   */
  private static final String SYS_PROP_WEBDRIVER_CHROME_DRIVER = "webdriver.chrome.driver";


  public WebDriver driver;


  @BeforeClass
  public void setBrowser() {
    // webdrvier should be in system path
//        String property = System.getProperty(SYS_PROP_WEBDRIVER_CHROME_DRIVER);
//        if (property == null || "".equals(property)) {
//            System.setProperty(SYS_PROP_WEBDRIVER_CHROME_DRIVER, "/home/artur/chromedriver");
//        }
    ChromeOptions chromeOptions = new ChromeOptions();
    chromeOptions.addArguments("--start-maximized");
    // --kiosk is alternative for --start-maximized
//    chromeOptions.addArguments("--kiosk");
    driver = new ChromeDriver(chromeOptions);
//    driver.manage().window().maximize();
    driver.get("http://localhost:4200/");
  }


  @AfterClass
  public void tearDown() {
//            driver.quit();
  }
}
