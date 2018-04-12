package testsSetup;

import adsharesDemo.DashboardPopup;
import adsharesDemo.LoginPage;
import adsharesDemo.publisher.*;
import enums.Properties;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import tools.Structure;
import tools.Xml;

public class BrowserSetup {
  /**
   * System property defining location of ChromeDriver used by Selenium
   */
  private static final String SYS_PROP_WEBDRIVER_CHROME_DRIVER = "webdriver.chrome.driver";

  protected LoginPage loginPage;
  protected DashboardPopup dashboardPopup;
  protected PublisherNewSite publisherNewSite;
  protected PublisherMainPage publisherMainPage;
  protected SiteAdditionalTargeting siteAdditionalTargeting;
  protected SiteCreateAds siteCreateAds;
  protected SiteSummary siteSummary;

  public WebDriver driver;

  protected String loginAdService;
  protected String passwordAdService;
  protected String flag;

  @BeforeClass
  public void setChrome() {
    String property = System.getProperty(SYS_PROP_WEBDRIVER_CHROME_DRIVER);
    if (property == null || "".equals(property)) {
      System.setProperty(SYS_PROP_WEBDRIVER_CHROME_DRIVER, "C:\\chromedriver.exe");
    }
    driver = new ChromeDriver();
    driver.manage().window().maximize();
    driver.get("http://localhost:4200/");
  }

  @BeforeTest
  public void setUp() {
    final String DEFAULT_VALUE = "-";

    flag = DEFAULT_VALUE;
    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.HASLO);
  }


  @AfterClass
  public void tearDown() {
//            driver.quit();
  }
}
